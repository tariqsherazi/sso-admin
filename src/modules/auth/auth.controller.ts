import { Body, Controller, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiDocument, RequiredPermissions, SkipAuth } from "../../common";
import { AuthService } from "./auth.service";
import { AuthTokenResponseDto, TokenDto } from "./_types";
import { changePasswordDto, CreateMemberRequestDto, InviteMemberRequestDto, PasswordRecoveryDto, recoverPasswordDto, RefreshTokenDto, RegisterMemberRequestDto, SigninCredentialsDto, verifyLinkRequestDto, VerifyLinkResponseDto, VeryfyOTPDto } from "../members/_types";
import { InviteMemberGuard } from "../../guards";
import { TOKEN_NAME } from "../../config";
import { CAN_INVITE_MEMBER } from "../../database/seed_data/permissions.data";

@ApiTags("Authentication")
@ApiBearerAuth(TOKEN_NAME)
@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @ApiDocument({
    successStatusCode: 201,
    requestDescription: "Registeration request for user to register in system and get the access token",
    responseDescription: "User registered successfully and granted access token",
    returnDataDto: AuthTokenResponseDto,
    errorResponses: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
  })
  @SkipAuth()
  @Post("/signup")
  signup(@Body() credentials: CreateMemberRequestDto): Promise<AuthTokenResponseDto> {
    return this.authService.signup(credentials);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Authentication request for user to fetch the access token",
    responseDescription: "User auhtenticated with valid credentials and granted access token",
    returnDataDto: AuthTokenResponseDto,
  })
  @SkipAuth()
  @Post("/signin")
  signin(@Body() credentials: SigninCredentialsDto): Promise<AuthTokenResponseDto> {
    return this.authService.signin(credentials);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Send a magic link to new member to register themself",
    responseDescription: "Magic link has been sent successfully",
    returnDataDto: Boolean,
    errorResponses: [401, 403, 400]
  })
  @RequiredPermissions(CAN_INVITE_MEMBER.slug)
  @UseGuards(InviteMemberGuard)
  @Post("/invite")
  async inviteMember(@Body() data: InviteMemberRequestDto): Promise<boolean> {
    return this.authService.inviteMembers(data);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Verify a token sent in email of user to register itself",
    responseDescription: "Token verified successfully",
    returnDataDto: VerifyLinkResponseDto,
    errorResponses: [401]
  })
  @SkipAuth()
  @Post("/verify-link")
  public verifyLink(@Body() dto: verifyLinkRequestDto): Promise<VerifyLinkResponseDto> {
    return this.authService.verifyLink(dto);
  }

  @ApiDocument({
    successStatusCode: 201,
    requestDescription: "Register yourself after veryfying the link from email",
    responseDescription: "Member registered successfully",
    returnDataDto: AuthTokenResponseDto,
    errorResponses: [401, 400, 409]
  })
  @SkipAuth()
  @Post("/register")
  registerMembers(@Body() credentials: RegisterMemberRequestDto): Promise<AuthTokenResponseDto> {
    return this.authService.registerMembers(credentials);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Initiates the password recovery process by sending an OTP to the user's email.",
    responseDescription: "OTP sent successfully to the user's email",
    returnDataDto: Boolean,
    errorResponses: [404, 400]
  })
  @SkipAuth()
  @Post("/forgot-password")
  passwordRecovery(@Body() data: PasswordRecoveryDto): Promise<boolean> {
    return this.authService.passwordRecovery(data);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Verifies the OTP provided by the user for password recovery.",
    responseDescription: "OTP verified successfully",
    returnDataDto: Boolean,
    errorResponses: [404, 401]
  })
  @SkipAuth()
  @Post("/verify-otp")
  verifyOTP(@Body() dto: VeryfyOTPDto): Promise<boolean> {
    return this.authService.verifyOTP(dto);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Recover the password of user",
    responseDescription: "Password updated successfully",
    returnDataDto: Boolean,
    errorResponses: [404, 401]
  })
  @SkipAuth()
  @Post("/password-recovery")
  recoverPassword(@Body() dto: recoverPasswordDto): Promise<boolean> {
    return this.authService.recoverPassword(dto);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Update the password of member when member wants to update his profile",
    responseDescription: "Password changed successfully",
    returnDataDto: Boolean,
    errorResponses: [400, 401, 404]
  })
  @Post("/change-password")
  changePassword(@Body() dto: changePasswordDto, @Request() req: any): Promise<boolean> {
    return this.authService.changePassword(req.user?.id, dto);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Request to refresh access and refresh tokens using a valid refresh token",
    responseDescription: "New access and refresh tokens generated",
    returnDataDto: TokenDto,
  })
  @SkipAuth()
  @Post('/refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokenDto> {
    return this.authService.generateRefreshToken(dto)
  }
} 
