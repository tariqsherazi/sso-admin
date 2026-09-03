import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Request, ValidationPipe } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApiDocument, PaginationFilters, PaginationParams, PaginationRequest, RequiredPermissions } from '../../common';
import { CreateApplicationRequestDto, UpdateApplicationRequestDto, ApplicationsResponseDto, ApplicationDetailsResponseDto } from './_types';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TOKEN_NAME } from '../../config';
import { CAN_CREATE_APPLICATION, CAN_DELETE_APPLICATION, CAN_REGENERATE_APPLICATION_HASH, CAN_UPDATE_APPLICATION, CAN_VIEW_APPLICATION } from '../../database/seed_data/permissions.data';

@ApiTags("Applications")
@ApiBearerAuth(TOKEN_NAME)
@Controller({ path: "applications", version: "1" })
export class ApplicationsController {
    constructor(private applicationService: ApplicationsService) { }

    @ApiDocument({
        successStatusCode: 201,
        requestDescription: "Create request for a new application.",
        responseDescription: "Application created successfully.",
        returnDataDto: ApplicationsResponseDto,
        errorResponses: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
    })
    @RequiredPermissions(CAN_CREATE_APPLICATION.slug)
    @Post()
    createApplication(@Body() payload: CreateApplicationRequestDto, @Request() req: any): Promise<ApplicationsResponseDto> {
        return this.applicationService.createAplication({ ...payload, createdBy: req.user.id });
    }

    @ApiDocument({
        requestDescription: "Get the list of all application with optional search filter. It will be fetched with specific sets of application otherwise rejected.",
        responseDescription: "Paginated list with data and paginate options.",
        returnDataDto: ApplicationsResponseDto,
        successStatusCode: 200,
        errorResponses: [404],
        pagination: true,
    })
    @ApiQuery({
        name: "search", type: "string", required: false, example: "application",
    })
    @RequiredPermissions(CAN_VIEW_APPLICATION.slug)
    @Get()
    async getApplications(@PaginationParams() pagination: PaginationRequest<PaginationFilters>) {
        return this.applicationService.getApplications(pagination);
    }

    @ApiDocument({
        requestDescription: "Request to get the application details.",
        responseDescription: "Fatched the application details.",
        returnDataDto: ApplicationDetailsResponseDto,
        successStatusCode: 200,
        errorResponses: [400, 404],
    })
    @RequiredPermissions(CAN_VIEW_APPLICATION.slug)
    @Get("/:id")
    public getApplicationById(@Param("id", ParseIntPipe) id: number): Promise<ApplicationDetailsResponseDto> {
        return this.applicationService.getApplicationById(id);
    }


    @ApiDocument({
        requestDescription: "Request to update a specific application.",
        responseDescription: "Application updated successfully.",
        returnDataDto: UpdateApplicationRequestDto,
        errorResponses: [409, 404, 403],
    })
    @RequiredPermissions(CAN_UPDATE_APPLICATION.slug)
    @Put("/:id")
    public updateApplication(@Param("id", ParseIntPipe) id: number, @Body(ValidationPipe,) applicationDto: UpdateApplicationRequestDto, @Request() req: any): Promise<ApplicationsResponseDto> {
        return this.applicationService.updateApplication(id, { ...applicationDto, updatedBy: req.user.id });
    }

    @ApiDocument({
        requestDescription: "Request to archive the Application",
        responseDescription: "Application archived successfully",
        returnDataDto: ApplicationsResponseDto,
        successStatusCode: 200,
        errorResponses: [400, 404],
    })
    @RequiredPermissions(CAN_DELETE_APPLICATION.slug)
    @Delete("/:id")
    public archiveApplication(@Param("id", ParseIntPipe) id: number, @Request() req: any): Promise<ApplicationsResponseDto> {
        return this.applicationService.archiveApplication({ id, deletedBy: req.user.id });
    }


    @ApiDocument({
        requestDescription: "Request to update the Application secret",
        responseDescription: "Application secret updated successfully",
        returnDataDto: ApplicationsResponseDto,
        successStatusCode: 200,
        errorResponses: [400, 404],
    })
    @RequiredPermissions(CAN_REGENERATE_APPLICATION_HASH.slug)
    @Put("/:id/secret/regenerate")
    public updateAppSecret(@Param("id", ParseIntPipe) id: number, @Request() req: any): Promise<ApplicationsResponseDto> {
        return this.applicationService.updateAppSecret({ id, updatedBy: req.user.id });
    }
}
