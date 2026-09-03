import {
	Controller, Param, Body, Get, Post, Put, ParseIntPipe,
} from "@nestjs/common";
import {
	ApiBearerAuth, ApiQuery, ApiTags,
} from "@nestjs/swagger";
import { TOKEN_NAME } from "../../config";
import { ApiDocument, PaginationFilters, RequiredPermissions } from "../../common";
import { PaginationParams, PaginationRequest, PaginationResponseDto } from "../../common";
import { PermissionsService } from "./permissions.service";
import { PermissionResponseDto } from "./_types";
import { CAN_VIEW_APPLICATION } from "src/database/seed_data/permissions.data";

@ApiTags("Permissions")
@ApiBearerAuth(TOKEN_NAME)
@Controller({
	path: "access/permissions",
	version: "1",
})
export class PermissionsController {
	constructor(private permissionsService: PermissionsService) { }

	@ApiDocument({
		requestDescription: "Get the list of user permissions with optional search filter. It will be fetched with specific sets of permissions otherwise rejected.",
		responseDescription: "Paginated list with data and paginate options.",
		returnDataDto: PermissionResponseDto,
		// successStatusCode: 200,
		errorResponses: [404],
		pagination: true,
	})
	@ApiQuery({
		name: "search", type: "string", required: false, example: "user",
	})
	@RequiredPermissions(CAN_VIEW_APPLICATION.slug)
	@Get("user/:userId")
	public getUserPermissions(@PaginationParams() pagination: PaginationRequest<PaginationFilters>, @Param('userId') userId: number):
		Promise<PaginationResponseDto<PermissionResponseDto>> {
		return this.permissionsService.getUserPermissions(pagination, userId);
	}

	@ApiDocument({
		requestDescription: "Get the list of all permissions with optional search filter. It will be fetched with specific sets of permissions otherwise rejected.",
		responseDescription: "Paginated list with data and paginate options.",
		returnDataDto: PermissionResponseDto,
		// successStatusCode: 200,
		errorResponses: [404],
		pagination: true,
	})
	@ApiQuery({
		name: "search", type: "string", required: false, example: "user",
	})
	@RequiredPermissions(CAN_VIEW_APPLICATION.slug)
	@Get()
	public getPermissions(@PaginationParams() pagination: PaginationRequest<PaginationFilters>):
		Promise<PaginationResponseDto<PermissionResponseDto>> {
		return this.permissionsService.getPermissions(pagination);
	}

	// @ApiDocument({
	// 	requestDescription: "Request to get the permission details using specific ID. Will be fetched with specific sets of permissions",
	// 	responseDescription: "Return the permissions object with details to that specific permission",
	// 	returnDataDto: PermissionResponseDto,
	// 	successStatusCode: 200,
	// 	errorResponses: [400, 404],
	// })
	// @Get("/:id")
	// public getPermissionById(@Param("id", ParseIntPipe) id: number): Promise<PermissionResponseDto> {
	// 	return this.permissionsService.getPermissionById(id);
	// }

	// @ApiDocument({
	// 	requestDescription: "Request to creat a new permission. Request will processed if user have sufficient permissions, rejected otherwise",
	// 	responseDescription: "Return the permissions object with details to newly created permission",
	// 	returnDataDto: PermissionResponseDto,
	// 	successStatusCode: 201,
	// })
	// @Post()
	// public createPermission(@Body() permissionDto: CreatePermissionRequestDto):
	// 	Promise<PermissionResponseDto> {
	// 	return this.permissionsService.createPermission(permissionDto);
	// }

	// @ApiDocument({
	// 	requestDescription: "Request to update a specific permission. Request will processed if user have sufficient permissions, rejected otherwise",
	// 	responseDescription: "Return the updated permissions object with details to permission",
	// 	returnDataDto: PermissionResponseDto,
	// 	errorResponses: [409, 404, 403],
	// })
	// @Put("/:id")
	// public updatePermission(@Param("id", ParseIntPipe) id: number, @Body() permissionDto: UpdatePermissionRequestDto):
	// 	Promise<PermissionResponseDto> {
	// 	return this.permissionsService.updatePermission(id, permissionDto);
	// }
}
