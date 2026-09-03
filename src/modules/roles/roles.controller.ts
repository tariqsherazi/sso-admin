import {
  Controller, Param, Body, Get, Post, Put, ParseIntPipe,
  UseGuards,
  Req,
  Delete,
} from "@nestjs/common";
import { TOKEN_NAME } from "../../config";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  ApiDocument, PaginationFilters, PaginationParams, PaginationRequest, PaginationResponseDto,
  RequiredPermissions,
} from "../../common";
import { UpdateRoleRequestDto, CreateRoleRequestDto, RoleResponseDto, RoleInviteMemberResponseDto } from "./_types";
import { RolesService } from "./roles.service";
import { CAN_CREATE_ROLE, CAN_UPDATE_ROLE, CAN_VIEW_ROLE } from "../../database/seed_data/permissions.data";
import { RolesGuard } from "src/guards";

@ApiTags("Roles")
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: "access/roles",
  version: "1",
})
export class RolesController {
  constructor(private rolesService: RolesService) { }

  @ApiDocument({
    requestDescription: "Fetch the list of roles in system. It required important priviliges otherwise access will be revoked",
    responseDescription: "Paginated list for roles based on criteria",
    pagination: true,
    returnDataDto: RoleResponseDto,
    errorResponses: [404, 401, 403],
  })
  @ApiQuery({
    name: "search", type: "string", required: false, example: "admin",
  })
  @RequiredPermissions(CAN_VIEW_ROLE.slug)
  @UseGuards(RolesGuard)
  @Get()
  public getRoles(@PaginationParams() pagination: PaginationRequest<PaginationFilters>)
    : Promise<PaginationResponseDto<RoleResponseDto>> {
    return this.rolesService.getRoles(pagination);
  }

  @ApiDocument({
    requestDescription: "Fetch the details of specific role using ID of that role. It required important priviliges otherwise access will be revoked",
    responseDescription: "Details of specific role whose id is provided",
    returnDataDto: RoleResponseDto,
    errorResponses: [404, 401, 403],
  })
  @RequiredPermissions(CAN_VIEW_ROLE.slug)
  @Get("/:id")
  public getRoleById(@Param("id", ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.rolesService.getRoleById(id);
  }

  @ApiDocument({
    requestDescription: "Request to create a new role in system. It required important priviliges otherwise access will be revoked",
    responseDescription: "Details of newly created role",
    returnDataDto: RoleResponseDto,
    errorResponses: [409, 401, 403, 406],
  })
  @RequiredPermissions(CAN_CREATE_ROLE.slug)
  @Post()
  public createRole(@Body() roleDto: CreateRoleRequestDto, @Req() req: any): Promise<RoleResponseDto> {
    return this.rolesService.createRole({ ...roleDto, createdBy: req.user?.id });
  }

  @ApiDocument({
    requestDescription: "update the details of specific role using ID of that role. It required important priviliges otherwise access will be revoked",
    responseDescription: "Details of updated role",
    returnDataDto: RoleResponseDto,
    errorResponses: [409, 404, 401, 403],
  })
  @RequiredPermissions(CAN_UPDATE_ROLE.slug)
  @Put("/:id")
  public updateRole(@Param("id", ParseIntPipe) id: number, @Body() roleDto: UpdateRoleRequestDto, @Req() req: any): Promise<RoleResponseDto> {
    return this.rolesService.updateRole(id, { ...roleDto, updatedBy: req.user?.id });
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Get Invite Member Roles",
    responseDescription: "list for  Member Invite roles",
    returnDataDto: RoleInviteMemberResponseDto,
    errorResponses: [400, 401],
  })
  @RequiredPermissions(CAN_VIEW_ROLE.slug)
  // i will change from post to get
  @Post("/invite-member")
  public getInviteMemberRoles(): Promise<RoleInviteMemberResponseDto[]> {
    return this.rolesService.getInviteMemberRole();
  }

  @ApiDocument({
    requestDescription: "Request to archive the Organization",
    responseDescription: "Return the archive data ",
    returnDataDto: RoleResponseDto,
    successStatusCode: 200,
    errorResponses: [400, 404]
  })
  @Delete('/:id')
  public delteRole(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<RoleResponseDto> {
    return this.rolesService.deleteRole({ id, deletedBy: req.user.id });
  }
}
