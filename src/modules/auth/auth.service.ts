import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { TokenService } from "./token.service";
import { SendgridService } from "../../external/email/email.service";
import { Logger } from "@nestjs/common/services";
import { AuthTokenResponseDto, TokenDto } from "./_types";
import { GeneralStatus, UserAuthStatus } from "../../database/entities/_enums";
import { EncryptionHelper } from "../../common/helpers";
import { MemberService } from "../members/member.service";
import { changePasswordDto, CreateMemberRequestDto, InviteMemberRequestDto, MemberMapper, PasswordRecoveryDto, recoverPasswordDto, RefreshTokenDto, RegisterMemberRequestDto, SigninCredentialsDto, verifyLinkRequestDto, VerifyLinkResponseDto, VeryfyOTPDto } from "../members/_types";
import { MemberEntity } from "../../database/entities/member.entity";
import { EmailType } from "../../external/email/_types";
import { RolesService } from "../roles/roles.service";
import { GlobalRoles } from "../../common";
import { ConfigService } from "@nestjs/config";
import { Secrets } from "../../config/secrets.config";
import { ConfigMapper } from "../../config";
import { OrganizationsService } from "../organizations/organization.service";

@Injectable()
export class AuthService {
  private config: Secrets;
  constructor(
    private tokenService: TokenService,
    private memberService: MemberService,
    private emailService: SendgridService,
    private roleService: RolesService,
    private configService: ConfigService,
    private organizationService: OrganizationsService,


  ) {
    this.config = this.configService.get<Secrets>(ConfigMapper.appConfig);
  }

  async signup(member: CreateMemberRequestDto): Promise<AuthTokenResponseDto> {
    member.email = member.email.toLowerCase();
    member.username = member.username || EncryptionHelper.addSalt(member.email.split("@")[0]);
    member.password = await EncryptionHelper.hash(member.password);
    let role_id = await this.roleService.getRole(GlobalRoles.MasterRole);
    member.role = role_id?.id
    const memberData = await this.memberService.createMember(member);

    const tokens: TokenDto = this.tokenService.generateAuthToken({
      id: memberData.id,
      username: memberData.username,
      email: memberData.email,
      userData: {
        role: memberData.role,
        // permissions: memberData.permissions,
        // organization: memberData.organization,
        permissions: memberData?.permissions?.map((x) => { return { slug: x.slug, id: x.id } }),
        organization: { id: memberData?.organization?.id, name: memberData?.organization?.name },
      }
    });

    return { ...tokens, user: memberData };
  }

  async signin(credentials: SigninCredentialsDto): Promise<AuthTokenResponseDto> {
    if (!credentials.email || !credentials.password) throw new BadRequestException("Email and password fields must not be empty");

    let memberEntity: MemberEntity = await this.memberService.findByEmail(credentials.email);

    if (!memberEntity)
      throw new UnauthorizedException(`No account found for user ${credentials.email}`);

    if (memberEntity.status !== UserAuthStatus.Active || (memberEntity.organization && memberEntity.organization.status !== GeneralStatus.Active))
      throw new UnauthorizedException(`Incorrect crdentials provided!`);

    const valid = await EncryptionHelper.compareHash(credentials.password, memberEntity.password);
    if (!valid) throw new UnauthorizedException(`Incorrect password provided for user ${credentials.email}`);

    const memberData = await MemberMapper.toDtoWithRelations(memberEntity);
    const tokens: TokenDto = this.tokenService.generateAuthToken({
      id: memberData.id,
      username: memberData.username,
      email: memberData.email,
      userData: {
        role: memberData.role,
        permissions: memberData.permissions?.map((x) => { return { slug: x.slug, id: x.id } }),
        organization: { id: memberData?.organization?.id, name: memberData?.organization?.name },
      }
    });


    // call to update the last login of user before returning from function
    this.memberService.updateLastLogin(memberEntity).catch(Logger.error);
    return { ...tokens, user: memberData };
  }

  async inviteMembers(dto: InviteMemberRequestDto): Promise<boolean> {
    const member = await this.memberService.findByEmail(dto.email);

    if (member) {
      throw new ConflictException("Member already exists with mentioned email");
    }

    let token = await this.tokenService.generateInvitationToken({
      email: dto.email?.toLowerCase(),
      username: EncryptionHelper.addSalt(dto.email?.split("@")[0]?.toLowerCase()),
      organization: dto.organization,
      role: { id: dto.role, name: dto.roleName },

    });

    if (dto.roleName === GlobalRoles.Owner) {
      this.organizationService.addHasOwnerToken(dto.organization, token);
    }

    await this.emailService.sendMailToSingleUser({
      to: dto.email,
    }, EmailType.EMAIL_MEMBER_INVITE, { token })
    return true
  }

  async verifyLink(dto: verifyLinkRequestDto): Promise<VerifyLinkResponseDto> {
    let payload = await this.tokenService.verifyInvitationToken(dto.token);
    if (payload?.role?.name == GlobalRoles.Owner) {
      await this.organizationService.verifyHasOwnerToken(dto.token)
    }
    return payload
  }

  async registerMembers(member: RegisterMemberRequestDto): Promise<AuthTokenResponseDto> {
    const exist = await this.memberService.findByEmail(member.email);
    if (exist) {
      throw new ConflictException("Member already exists ");
    }
    let payload = await this.tokenService.verifyInvitationToken(member.token)
    member.email = payload.email
    member.organization = payload?.organization
    member.role = payload.role?.id
    if (payload?.role?.name === GlobalRoles.Owner) {
      let organizatioln = await this.organizationService.getOrganziationById(member.organization)
      if (organizatioln.hasOwner) {

        throw new ConflictException("Owner already exists");
      }
    }
    member.password = await EncryptionHelper.hash(member.password);
    const memberData = await this.memberService.createMember(member);

    if (member.organization && payload?.role?.name === GlobalRoles.Owner) {
      this.organizationService.updateOrganizationOwner(member.organization, true)
      this.organizationService.addHasOwnerToken(member.organization, null)
    }

    const tokens: TokenDto = this.tokenService.generateAuthToken({
      id: memberData.id,
      username: memberData.username,
      email: memberData.email,
      userData: {
        role: memberData.role,
        // permissions: memberData.permissions,
        // organization: memberData.organization,
        permissions: memberData?.permissions?.map((x) => { return { slug: x.slug, id: x.id } }),
        organization: { id: memberData?.organization?.id, name: memberData?.organization?.name },
      }
    });

    return { ...tokens, user: memberData };

  }

  async passwordRecovery(dto: PasswordRecoveryDto): Promise<boolean> {

    let user = await this.memberService.findByEmail(dto.email);
    if (!user) throw new NotFoundException(`No account found for member ${dto.email}`);
    const otp = EncryptionHelper.randomNumberGenerator(6).toString();
    this.emailService.sendMailToSingleUser({ to: dto.email }, EmailType.PASSWORD_RECOVERY, { otp, name: `${user?.firstName}  ${user?.lastName}` });
    const otpExpiryTime = new Date();
    const expireMinute = +this.config.otpExpiresIn;
    console.log(otp, "otp", expireMinute)
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + expireMinute);
    user.passwordRecoveryToken = otp;
    user.recoveryTokenTime = otpExpiryTime;
    await this.memberService.findAndUpdateMember({ email: user.email }, user)
    return true
  }

  async verifyOTP(dto: VeryfyOTPDto): Promise<boolean> {
    const user = await this.memberService.findByEmail(dto.email);
    let msg
    if (!user || !user.passwordRecoveryToken) {
      msg = !user ? `No account found for user ${dto.email}` : "OTP is not registered against you. Please request an OTP first."
      throw new NotFoundException(msg);
    }
    const currentTime = new Date();
    if (dto.otp != user.passwordRecoveryToken || currentTime > user.recoveryTokenTime) {
      msg = dto.otp != user.passwordRecoveryToken ? `Invalid OTP. Please check and try again.` : "OTP has expired. Please request a new one."
      throw new UnauthorizedException(msg);
    }
    return true;
  }

  async recoverPassword(dto: recoverPasswordDto): Promise<boolean> {
    await this.verifyOTP({ email: dto.email, otp: dto.otp });
    const user = await this.memberService.findByEmail(dto.email);
    user.password = await EncryptionHelper.hash(dto.password);
    user.passwordRecoveryToken = null;
    user.recoveryTokenTime = null;
    await this.memberService.findAndUpdateMember({ email: user.email }, user)
    return true
  }

  async changePassword(id: number, dto: changePasswordDto): Promise<boolean> {
    let user = await this.memberService.getOne({ id });
    if (!user) throw new NotFoundException(`No account found for mentioned member`);

    const valid = await EncryptionHelper.compareHash(dto.password, user.password);
    if (!valid) throw new UnauthorizedException(`Incorrect password provided for member`);

    user.password = await EncryptionHelper.hash(dto.newPassword);
    await this.memberService.findAndUpdateMember({ email: user.email }, user)
    return true
  }

  async generateRefreshToken(dto: RefreshTokenDto) {
    const { valid } = await this.tokenService.validateToken(dto.token)
    if (valid)
      return this.tokenService.generateRefreshToken(dto.token);
    else throw new UnauthorizedException("Invalid token!")
  }
}
