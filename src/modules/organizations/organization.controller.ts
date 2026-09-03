import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiDocument, PaginationFilters, PaginationParams, PaginationRequest, RequiredPermissions } from '../../common';
import { OrganizationsService } from './organization.service';
import { CreateOrganizationRequestDto, UpdateOrganizationRequestDto, OrganizationResponseDto, OrganizationDetailsResponseDto } from './_types';
import { OrganizationFilterGuard } from '../../guards/organization.guard';
import { TOKEN_NAME } from '../../config';
import { CAN_CREATE_ORGANIZATION, CAN_DELETE_ORGANIZATION, CAN_UPDATE_ORGANIZATION, CAN_VIEW_ORGANIZATION } from '../../database/seed_data/permissions.data';


@ApiTags("Organizations")
@ApiBearerAuth(TOKEN_NAME)
@Controller({ path: "organization", version: "1" })
export class OrganizationsController {


	constructor(private organizationService: OrganizationsService) { }

	@ApiDocument({
		successStatusCode: 201,
		requestDescription: "create request for organization ",
		responseDescription: "organization created successfully",
		returnDataDto: OrganizationResponseDto,
		errorResponses: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
	})
	@RequiredPermissions(CAN_CREATE_ORGANIZATION.slug)
	@Post()
	createOrganziation(@Body() payload: CreateOrganizationRequestDto, @Request() req: any): Promise<OrganizationResponseDto> {
		return this.organizationService.createOrganziation({ ...payload, createdBy: req.user.id });
	}

	@ApiDocument({
		requestDescription: "Get the list of all organization with optional search filter. It will be fetched with specific sets of organization otherwise rejected.",
		responseDescription: "Paginated list with data and paginate options.",
		returnDataDto: OrganizationResponseDto,
		successStatusCode: 200,
		errorResponses: [404],
		pagination: true,
	})
	@ApiQuery({
		name: "search", type: "string", required: false, example: "organization",
	})
	@UseGuards(OrganizationFilterGuard)
	@RequiredPermissions(CAN_VIEW_ORGANIZATION.slug)
	@Get()
	async getOrganziations(@PaginationParams() pagination: PaginationRequest<PaginationFilters>) {
		return this.organizationService.getOrganziations(pagination);
	}

	@ApiDocument({
		requestDescription: "Request to get the Organization details",
		responseDescription: "Return the Organization details ",
		returnDataDto: OrganizationDetailsResponseDto,
		successStatusCode: 200,
		errorResponses: [400, 404],
	})
	@RequiredPermissions(CAN_VIEW_ORGANIZATION.slug)
	@Get("/:id")
	public getOrganizationById(@Param("id", ParseIntPipe) id: number): Promise<OrganizationDetailsResponseDto> {
		return this.organizationService.getOrganziationById(id);
	}

	@ApiDocument({
		requestDescription: "Request to update a specific organization",
		responseDescription: "Organization  updated successfully",
		returnDataDto: UpdateOrganizationRequestDto,
		errorResponses: [409, 404, 403],
	})
	@RequiredPermissions(CAN_UPDATE_ORGANIZATION.slug)
	@Put("/:id")
	public updateOrganization(@Param("id", ParseIntPipe) id: number, @Body(ValidationPipe,) OrganizationDto: UpdateOrganizationRequestDto, @Request() req: any): Promise<OrganizationResponseDto> {
		return this.organizationService.updateOrganization(id, { ...OrganizationDto, updatedBy: req.user.id });
	}


	@ApiDocument({
		requestDescription: "Request to archive the Organization",
		responseDescription: "Return the archive data ",
		returnDataDto: OrganizationResponseDto,
		successStatusCode: 200,
		errorResponses: [400, 404],
	})
	@RequiredPermissions(CAN_DELETE_ORGANIZATION.slug)
	@Delete("/:id")
	public archiveOrganization(@Param("id", ParseIntPipe) id: number, @Request() req: any): Promise<OrganizationResponseDto> {
		return this.organizationService.archiveOrganization({ id, deletedBy: req.user.id });
	}

}
