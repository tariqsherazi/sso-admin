import {
  ValidationPipe, ParseIntPipe, Controller, Param, Post, Body, Get, Put, Request,
  Req,
  Delete,
  HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { TOKEN_NAME } from "../../config";
import {
  ApiDocument,
  PaginationParams, PaginationRequest, PaginationResponseDto,
  RequiredPermissions,
} from "../../common";
import {
  changeUserPasswordDto,
  CreateUserRequestDto,
  UpdateUserRequestDto, UserFilterParams, UserResponseDto,
  verifyOtpDto,
  verifyUserDto,
} from "./_types";
import { UsersService } from "./users.service";
import { CAN_CREATE_USER, CAN_DELETE_USER, CAN_UPDATE_USER, CAN_VIEW_USER } from "../../database/seed_data/permissions.data";

@ApiTags("Users")
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: "users",
  version: "1",
})
export class UsersController {
  constructor(private usersService: UsersService) { }

  @ApiDocument({
    requestDescription: "Fetch the list of all users",
    responseDescription: "Fetched the paginated users list with their details",
    returnDataDto: UserResponseDto,
    pagination: true,
    successStatusCode: 200,
  })
  @ApiQuery({
    name: "search", type: "string", required: false, example: "admin",
  })
  @ApiQuery({
    name: "role_id", type: "number", required: false, example: "1",
  })
  @RequiredPermissions(CAN_VIEW_USER.slug)
  @Get()
  public getUsers(@PaginationParams() pagination: PaginationRequest<UserFilterParams>)
    : Promise<PaginationResponseDto<UserResponseDto>> {
    return this.usersService.getUsers(pagination);
  }
  @RequiredPermissions(CAN_VIEW_USER.slug)
  @Get("/:id")
  public getUserById(@Param("id", ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.getUserById(id);
  }

  @RequiredPermissions(CAN_CREATE_USER.slug)
  @ApiDocument({
    successStatusCode: 201,
    requestDescription: "Create request for a new User.",
    responseDescription: "User created successfully.",
    returnDataDto: UserResponseDto,
    errorResponses: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
  })
  @Post()
  public createUser(@Request() req, @Body(ValidationPipe) UserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.usersService.createUser(UserDto);
  }

  @ApiDocument({
    requestDescription: "Request to update a specific User.",
    responseDescription: "User updated successfully.",
    returnDataDto: UserResponseDto,
    errorResponses: [409, 404, 403],
  })

  @RequiredPermissions(CAN_UPDATE_USER.slug)
  @Put("/:id")
  public updateUser(@Param("id", ParseIntPipe) id: number, @Body(ValidationPipe) UserDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, UserDto);
  }

  @ApiDocument({
    requestDescription: "Request to archive the User",
    responseDescription: "User archived successfully",
    returnDataDto: UserResponseDto,
    successStatusCode: 200,
    errorResponses: [400, 404],
  })
  @RequiredPermissions(CAN_DELETE_USER.slug)
  @Delete('/:id')
  public delteUser(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<UserResponseDto> {
    return this.usersService.archiveUser({ id, deletedBy: req.user.id })
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Update the password of User when user wants to change his password",
    responseDescription: "Password changed successfully",
    returnDataDto: Boolean,
    errorResponses: [400, 401, 404]
  })
  @Put("/change-password/:id")
  changeUserPassword(@Param("id", ParseIntPipe) id: number, @Body() dto: changeUserPasswordDto): Promise<boolean> {
    return this.usersService.changeUserPassword(id, dto);
  }

  // @ApiDocument({
  //   requestDescription: "Request to verify account",
  //   responseDescription: "Email has send to your email pls verify your account ",
  //   returnDataDto: Boolean,
  //   successStatusCode: 200,
  // })

  // @Post("/verify-user")
  // public sendVerifyLink(@Req() req: any): Promise<boolean> {
  //   return this.usersService.sendVerifyLink(req.user.id);
  // }

  // @ApiDocument({
  //   requestDescription: "verify OTP",
  //   responseDescription: "Your account verified successfully",
  //   returnDataDto: verifyOtpDto,
  //   successStatusCode: 200,
  // })

  // @Post("/verify-otp")
  // public verifyOtp(@Body() dto: verifyOtpDto, @Req() req: any): Promise<boolean> {
  //   return this.usersService.verifyOTP({ ...dto, userId: req.user.id });
  // }
  @ApiDocument({
    requestDescription: "verify User",
    responseDescription: "User account verified successfully",
    returnDataDto: Boolean,
    successStatusCode: 200,
  })
  @Post("/verify-user")
  public verifyUser(@Body() dto: verifyUserDto): Promise<boolean> {
    return this.usersService.verifyUser(dto);
  }

}