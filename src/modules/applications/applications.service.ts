import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationRepository } from './application.reponsitry';
import { ArchiveApplicationRequestDto, CreateApplicationRequestDto, UpdateApplicationRequestDto, ApplicationMapper, ApplicationsResponseDto, appSecretUpdateRequestDto, ApplicationDetailsResponseDto, FilterByOrganizationRequestDto } from './_types';
import { Pagination, PaginationFilters, PaginationRequest, PaginationResponseDto } from '../../common';
import { v4 as uuidV4 } from 'uuid';
import { ApplicationsEntity } from '../../database/entities/application.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { In } from 'typeorm';
@Injectable()
export class ApplicationsService {

    constructor(
        @InjectRepository(ApplicationRepository)
        private applicationRepository: ApplicationRepository,
        private permissionService: PermissionsService,
    ) { }

    async createAplication(applicationDto: CreateApplicationRequestDto): Promise<ApplicationsResponseDto> {
        let exist = await this.applicationRepository.searchApplicationByName(applicationDto)
        if (exist) throw new ConflictException(`Already exist ${applicationDto.appName}`)
        let application = ApplicationMapper.toCreateEntity(applicationDto);
        application = await this.applicationRepository.save(application);
        this.permissionService.createPermission({
            organization: applicationDto.organization,
            slug: `${application.id}-${application.appName?.replace(/\s+/g, ".")?.toLowerCase()}`,
            name: application.appName,
            description: `User having this permission can access or login into ${application.appName} Applications `,
            appId: application.id,
            createdBy: applicationDto.createdBy

        }).catch(err => new Logger(ApplicationsService.name).error);
        return ApplicationMapper.toDto(application);
    }

    public async getApplications(pagination: PaginationRequest<PaginationFilters>): Promise<PaginationResponseDto<ApplicationsResponseDto>> {
        const [applicationEntities, totalApplications] = await this.applicationRepository.getApplicationAndCount(
            pagination,
        );
        const applicationDtos = await Promise.all(applicationEntities.map(ApplicationMapper.toDto));

        return Pagination.of(pagination, totalApplications, applicationDtos);
    }

    public async getApplicationById(id: number): Promise<ApplicationDetailsResponseDto> {
        const applicationEntity = await this.applicationRepository.getApplicationDetailsAndCount(id);
        if (!applicationEntity) {
            throw new NotFoundException(`Application with id ${id} not found`);
        }
        const applicatonDtp = ApplicationMapper.toDetailsDto(applicationEntity);
        return applicatonDtp;
    }

    public async updateApplication(id: number, applicationDto: UpdateApplicationRequestDto): Promise<ApplicationsResponseDto> {
        let applicationtoEntity = await this.applicationRepository.findOne({ where: { id, isArchive: false } });
        if (!applicationtoEntity) {
            throw new NotFoundException(`applicationto with id=${id} cannot be found in system`);
        }
        if (applicationDto.appName) {
            let exist = await this.applicationRepository.searchApplicationByName(applicationDto)
            if (exist && exist?.id != applicationtoEntity.id) throw new ConflictException(`Already exist ${applicationDto.appName}`)
        }
        applicationtoEntity = ApplicationMapper.toUpdateEntity(applicationtoEntity, applicationDto);
        applicationtoEntity = await this.applicationRepository.save(applicationtoEntity);

        this.permissionService.updatePermission(id, {
            slug: `${applicationtoEntity.id}-${applicationtoEntity.appName?.replace(/\s+/g, ".")?.toLowerCase()}`,
            name: applicationtoEntity.appName,
            updatedBy: applicationDto.updatedBy,
            organization: applicationDto.organization,
            description: `User having this permission can access or login into ${applicationtoEntity.appName} Applications `,

        }).catch(err => new Logger(ApplicationsService.name).error);

        return ApplicationMapper.toDto(applicationtoEntity);
    }

    public async archiveApplication(archiveDto: ArchiveApplicationRequestDto): Promise<ApplicationsResponseDto> {
        let applicationtoEntity = await this.applicationRepository.findOne({ where: { id: archiveDto.id, isArchive: false } });
        if (!applicationtoEntity) {
            throw new NotFoundException(`application with id=${archiveDto.id} cannot be found in system`);
        }

        applicationtoEntity = ApplicationMapper.toArchiveEntity(applicationtoEntity, { deletedBy: archiveDto.deletedBy, isArchive: true });
        applicationtoEntity = await this.applicationRepository.save(applicationtoEntity);
        await this.applicationRepository.softDelete({ id: applicationtoEntity.id });

        this.permissionService.archivePermision({
            id: applicationtoEntity.id,
            deletedBy: applicationtoEntity.deletedBy,
            isArchive: true
        }).catch(err => new Logger(ApplicationsService.name).error);

        return ApplicationMapper.toDto(applicationtoEntity);
    }

    public async updateAppSecret(dto: appSecretUpdateRequestDto): Promise<ApplicationsResponseDto> {
        let applicationtoEntity = await this.applicationRepository.findOne({ where: { id: dto.id, isArchive: false } });
        if (!applicationtoEntity) {
            throw new NotFoundException(`application with id=${dto.id} cannot be found in system`);
        }
        applicationtoEntity = ApplicationMapper.toUpdateSecret(applicationtoEntity, { appSecret: `secret_${uuidV4()}`, updatedBy: dto.updatedBy });
        applicationtoEntity = await this.applicationRepository.save(applicationtoEntity);

        return ApplicationMapper.toDetailsDto(applicationtoEntity);
    }

    public async countApplicationsByOrganizaions(organizationIds: number[]): Promise<number> {
        return this.applicationRepository.countBy({ organization: { id: In(organizationIds) } });
    }


    public async changeApplicatonStatusByOrganizatoin(dto: FilterByOrganizationRequestDto): Promise<ApplicationsEntity> {
        let applicationEntity = await this.applicationRepository.findOne({ where: {organization: dto?.organizationId as any} })
        if (!applicationEntity) {
            throw new NotFoundException(`application with organizatoin=${dto.organizationId} cannot be found in system`);
        }
        applicationEntity['status'] = dto.status;
        return this.applicationRepository.save(applicationEntity)
    }
}
