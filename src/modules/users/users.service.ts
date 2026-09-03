import { NotFoundException, Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EncryptionHelper, Pagination, PaginationRequest, PaginationResponseDto } from "../../common";
import {
  UserMapper,
  CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto, UserFilterParams,
  changeUserPasswordDto,
  verifyOtpDto,
  verifyUserDto,
} from "./_types";
import { UsersRepository } from "./users.repository";
import { ArchiveMemberRequestDto, FindByOrganizationRequestDto, VeryfyOTPDto } from "../members/_types";
import { In } from "typeorm";
import { UserAuthStatus } from "../../database/entities/_enums";
import { UserEntity } from "../../../src/database/entities/user.entity";
import { SendgridService } from "../../external/email/email.service";
import { EmailType } from "src/external/email/_types";
import { ConfigService } from "@nestjs/config";
import { Secrets } from "src/config/secrets.config";
import { ConfigMapper } from "src/config";
import { PermissionEntity } from "src/database/entities/permission.entity";

@Injectable()
export class UsersService {
  private config: Secrets;
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private emailService: SendgridService,
    private configService: ConfigService
  ) {
    this.config = this.configService.get<Secrets>(ConfigMapper.appConfig);
  }

  /**
   * Get a paginated user list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<UserResponseDto>>}
   */
  public async getUsers(pagination: PaginationRequest<UserFilterParams>)
    : Promise<PaginationResponseDto<UserResponseDto>> {
    const [userEntities, totalUsers] = await this.usersRepository.getUsersAndCount(pagination);

    const UserDtos = await Promise.all(userEntities.map(UserMapper.toDtoWithRelations));
    return Pagination.of(pagination, totalUsers, UserDtos);
  }

  /**
   * Get user by id
   * @param id {string}
   * @returns {Promise<UserResponseDto>}
   */
  public async getUserById(id: number): Promise<UserResponseDto> {
    const userEntity = await this.usersRepository.findOne({
      where: { id }, relations: ["permissions", "roles", "organization"],
      select: {
        organization: { name: true, domain: true, id: true, orgId: true },
      },
    });
    if (!userEntity) {
      throw new NotFoundException();
    }

    return UserMapper.toDtoWithRelations(userEntity);
  }

  /**
   * Create new user
   * @param userDto {CreateUserRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async createUser(userDto: CreateUserRequestDto): Promise<UserResponseDto> {
    userDto.password = await EncryptionHelper.hash(userDto.password);
    let userEntity = UserMapper.toCreateEntity(userDto);
    await this.usersRepository.save(userEntity);
    userEntity = await this.usersRepository.findOne({ where: { id: userEntity.id }, relations: ["permissions", "roles", "organization"] });
    return UserMapper.toDtoWithRelations(userEntity);
  }

  /**
   * Update User by id
   * @param id {id}
   * @param userDto {UpdateUserRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async updateUser(id: number, userDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    let userEntity = await this.usersRepository.findOne({ where: { id } });
    if (!userEntity) {
      throw new NotFoundException(`User with id=${id} cannot be found in system`);
    }
    userEntity = UserMapper.toUpdateEntity(userEntity, userDto);
    userEntity = await this.usersRepository.save(userEntity);
    return UserMapper.toDtoWithRelations(userEntity);
  }

  public async countUsersByRole(roleId): Promise<number> {
    return this.usersRepository.countBy({ roles: { id: roleId } });
  }

  public async archiveUser(archiveDTo: ArchiveMemberRequestDto): Promise<UserResponseDto> {
    let userEntity = await this.usersRepository.findOne({ where: { id: archiveDTo.id, isArchive: false } })

    if (!userEntity) {
      throw new NotFoundException(`user with id=${archiveDTo.id} can not found in system`)
    }

    userEntity = UserMapper.toArchiveUserEntity(userEntity, { deletedBy: archiveDTo.deletedBy, isArchive: true })
    userEntity = await this.usersRepository.save(userEntity);
    await this.usersRepository.softDelete({ id: userEntity.id });
    return UserMapper.toDto(userEntity);
  }

  public async countUsersByOrganizaions(organizationIds: number[], activeOnly = false): Promise<number> {
    if (activeOnly)
      return this.usersRepository.countBy({ organization: { id: In(organizationIds) }, status: UserAuthStatus.Active });
    return this.usersRepository.countBy({ organization: { id: In(organizationIds) } });
  }


  // ************** Change User Password By Id **************
  public async changeUserPassword(id: number, dto: changeUserPasswordDto): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id } });     // Fetch the user by ID
    if (!user) throw new NotFoundException(`No account found for user ${id}`);

    // Hash the new password and update the user entity
    user.password = await EncryptionHelper.hash(dto.newPassword);
    await this.usersRepository.save(user);
    return true;
  }

  public async changeUsreStatusByOrganizatoin(dto: FindByOrganizationRequestDto): Promise<UserEntity> {
    let UserEntity = await this.usersRepository.findOne({ where: { organization: dto?.organizationId as any } })
    if (!UserEntity) {
      throw new NotFoundException(`User with organizatoin=${dto.organizationId} cannot be found in system`);
    }
    UserEntity['status'] = dto.status;
    return this.usersRepository.save(UserEntity)
  }

  public async sendVerifyLink(id: number): Promise<boolean> {

    let user = await this.usersRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with organizatoin=${id} cannot be found in system`);
    }
    if (user.emailVerified) throw new ConflictException(`Your account already verified`);

    const otp = EncryptionHelper.randomNumberGenerator(6).toString();
    const otpExpiryTime = new Date();
    const expireMinute = +this.config.otpExpiresIn;
    console.log(otp, "otp", expireMinute)
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + expireMinute);
    user.passwordRecoveryToken = otp;
    user.recoveryTokenTime = otpExpiryTime;

    this.emailService.sendMailToSingleUser({
      to: user.email,
    }, EmailType.EMAIL_USER_VERIFICARION, { otp })
    this.usersRepository.save(user)

    return true
  }

  async verifyOTP(dto: verifyOtpDto): Promise<boolean> {
    let user = await this.usersRepository.findOne({ where: { id: dto.userId } })
    let msg
    if (!user || !user.passwordRecoveryToken) {
      msg = !user ? `No account found for user ${dto.userId}` : "OTP is not registered against you. Please request an OTP first."
      throw new NotFoundException(msg);
    }
    const currentTime = new Date();
    if (dto.otp != user.passwordRecoveryToken || currentTime > user.recoveryTokenTime) {
      msg = dto.otp != user.passwordRecoveryToken ? `Invalid OTP. Please check and try again.` : "OTP has expired. Please request a new one."
      throw new UnauthorizedException(msg);
    }

    user.passwordRecoveryToken = null;
    user.recoveryTokenTime = null;
    user.emailVerified = true;
    this.usersRepository.save(user)
    return true;
  }

  public async getUserRolePermissions(id: number): Promise<PermissionEntity[]> {
    const userEntity = await this.usersRepository.findOne({
      where: { id },
      relations: ["roles", "roles.permissions"]
    })
    if (!userEntity) {
      return [];
    }
    const permissions: PermissionEntity[] = [];

    await Promise.all((await userEntity.roles).map(async (role) =>
      await Promise.all((await role.permissions).map((permission) => {
        permissions.push(permission);
      }))
    ));

    return permissions;
  }

  public async getUserPermission(id: number): Promise<PermissionEntity[]> {
    const userEntity = await this.usersRepository.findOne({
      where: { id },
      relations: ["permissions"]
    })
    if (!userEntity) {
      return [];
    }
    return Promise.all(
      (await userEntity.permissions).map(perm => perm),
    )
  }


  async verifyUser(dto: verifyUserDto): Promise<boolean> {
    console.log(dto)
    let user = await this.usersRepository.findOne({ where: { id: dto.userId } })
    if (!user) {
      throw new NotFoundException(`No account found for user ${dto.userId}`);
    }
    user.emailVerified = true;
    await this.usersRepository.save(user)
    return true;
  }
}
