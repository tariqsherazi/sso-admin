import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PaginationFilters, PaginationRequest } from "../../common";
import { ApplicationsEntity } from "../../database/entities/application.entity";
import { MemberEntity } from "../../database/entities/member.entity";
import { OrganizationEntity } from "../../database/entities/organization.entity";
import { FilterApplicationRequestDto } from "./_types/application.request.dtos";

@Injectable()
export class ApplicationRepository extends Repository<ApplicationsEntity> {
    constructor(private dataSource: DataSource) {
        super(ApplicationsEntity, dataSource.createEntityManager());
    }

    /**
    * Get Applications list
    * @param pagination {PaginationRequest}
    * @returns [ApplicationsEntity: ApplicationsEntity[], totalApplications: number]
    */
    public async getApplicationAndCount(pagination: PaginationRequest<PaginationFilters>):
        Promise<[applicationEntities: ApplicationsEntity[], totalApplications: number]> {
        const {
            skip, limit: take, order, params: { search, organizationIds },
        } = pagination;

        const query = this.createQueryBuilder('entity')
            .leftJoinAndSelect(MemberEntity, 'createdBy', 'entity.createdBy = createdBy.id')
            .leftJoinAndSelect(MemberEntity, 'updatedBy', 'entity.updatedBy = updatedBy.id')
            .leftJoinAndSelect(OrganizationEntity, 'org', 'entity.organization = org.id')
            .where('entity.isArchive = false')
            .orderBy(order)
            .offset(skip)
            .limit(take)
            .select([
                'entity.*',
                'org.id AS org_id',
                'org.domain AS org_domain',
                'org.name AS org_name',
                'org.logo AS org_logo',
                'createdBy.id AS created_by_id',
                'createdBy.firstName AS created_by_firstname',
                'createdBy.lastName AS created_by_lastname',
                'createdBy.profilePicture AS created_by_profile_picture',
                'updatedBy.id AS updated_by_id',
                'updatedBy.firstName AS updated_by_first_name',
                'updatedBy.lastName AS updated_by_last_name',
                'updatedBy.profilePicture AS updated_by_profile_picture',
                'COUNT(entity.id) OVER() AS total_applications'
            ]);
        if (search) {
            query.andWhere("entity.appName ILIKE :search", { search: `%${search}%` });
        }
        if (organizationIds?.length) {
            query.andWhere("entity.organization IN (:...organizationIds) ", { organizationIds });
        } else {
            // When organizationIds is empty, ensure the query returns nothing
            query.andWhere("1 = 0");
        }
        const result = await query.getRawMany();
        const totalApplications: number = Number(result.length > 0 ? result[0].total_applications : 0);

        const entities: ApplicationsEntity[] = result.map((record: any) => new ApplicationsEntity({
            id: record.id,
            appId: record.app_id,
            appName: record.app_name,
            appSecret: record.app_secret,
            logo: record.logo,
            organization: new OrganizationEntity({ id: record.org_id, name: record.org_name, domain: record.org_name, logo: record.org_logo }),
            redirectUri: String(record.redirect_uri)?.split(','),
            status: record.status,
            url: record.url,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            createdBy: {
                id: record.created_by_id,
                firstName: record.created_by_firstname,
                lastName: record.created_by_lastname,
                profilePicture: record.created_by_profile_picture
            },
            updatedBy: {
                id: record.updated_by_id,
                firstName: record.updated_by_first_name,
                lastName: record.updated_by_last_name,
                profilePicture: record.updated_by_profile_picture
            },
        }));

        return [entities, totalApplications];
    }

    public async getApplicationDetailsAndCount(id: number): Promise<ApplicationsEntity> {
        const query = this.createQueryBuilder("entity")
            .leftJoinAndSelect(MemberEntity, 'createdBy', 'entity.createdBy = createdBy.id')
            .leftJoinAndSelect(MemberEntity, 'updatedBy', 'entity.updatedBy = updatedBy.id')
            .leftJoinAndSelect(OrganizationEntity, 'org', 'entity.organization = org.id')
            .where('entity.id = :id', { id })
            .select([
                'entity.*',
                'org.id AS org_id',
                'org.domain AS org_domain',
                'org.name AS org_name',
                'org.logo AS org_logo',
                'createdBy.id AS created_by_id',
                'createdBy.firstName AS created_by_firstname',
                'createdBy.lastName AS created_by_lastname',
                'createdBy.profilePicture AS created_by_profile_picture',
                'updatedBy.id AS updated_by_id',
                'updatedBy.firstName AS updated_by_first_name',
                'updatedBy.lastName AS updated_by_last_name',
                'updatedBy.profilePicture AS updated_by_profile_picture'
            ]);
        const result = await query.getRawOne();

        return new ApplicationsEntity({
            id: result.id,
            appId: result.app_id,
            appName: result.app_name,
            appSecret: result.app_secret,
            logo: result.logo,
            organization: new OrganizationEntity({ id: result.org_id, name: result.org_name, domain: result.org_name, logo: result.org_logo }),
            redirectUri: String(result.redirect_uri)?.split(','),
            status: result.status,
            url: result.url,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            createdBy: {
                id: result.created_by_id,
                firstName: result.created_by_firstname,
                lastName: result.created_by_lastname,
                profilePicture: result.created_by_profile_picture
            },
            updatedBy: {
                id: result.updated_by_id,
                firstName: result.updated_by_first_name,
                lastName: result.updated_by_last_name,
                profilePicture: result.updated_by_profile_picture
            },
        });
    }

    public async searchApplicationByName(dto: FilterApplicationRequestDto): Promise<ApplicationsEntity> {
        return this.createQueryBuilder('app')
            .where('LOWER(TRIM(app.appName)) = LOWER(:appName)', { appName: dto.appName?.trim() })
            .andWhere('app.organization = :organization', { organization: dto.organization })
            .getOne();
    }
}
