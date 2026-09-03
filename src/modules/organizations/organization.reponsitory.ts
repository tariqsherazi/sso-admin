import { OrganizationDetailsResponseDto } from './_types/organization.reponse.dtos';
import { Injectable } from "@nestjs/common";
import { DataSource, Raw, Repository } from "typeorm";
import { PaginationFilters, PaginationRequest } from "../../common";
import { OrganizationEntity } from "../../database/entities/organization.entity";
import { MemberEntity } from "../../database/entities/member.entity";
import { ApplicationsEntity } from "../../database/entities/application.entity";
import { UserEntity } from '../../database/entities/user.entity';
import { FilterOrganizationRequestDto } from './_types/organization.request.dtos';

@Injectable()
export class OrganizationRepository extends Repository<OrganizationEntity> {
  constructor(private dataSource: DataSource) {
    super(OrganizationEntity, dataSource.createEntityManager());
  }

  /**
  * Get Organization list
  * @param pagination {PaginationRequest}
  * @returns [OrganizationEntities: OrganizationEntity[], totalOrganizations: number]
  */
  public async getOrganizationAndCount(pagination: PaginationRequest<PaginationFilters>):
    Promise<[organizationEntities: OrganizationEntity[], totalOrganizations: number]> {
    const {
      skip, limit: take, order, params: { search, userId },
    } = pagination;

    const query = this.createQueryBuilder("entity")
      .leftJoin(MemberEntity, 'createdBy', 'entity.createdBy = createdBy.id')
      .leftJoin(MemberEntity, 'updatedBy', 'entity.updatedBy = updatedBy.id')
      .leftJoin(UserEntity, 'user', 'user.organization = entity.id')
      .leftJoin(ApplicationsEntity, 'application', 'application.organization = entity.id')
      .select([
        'entity.*',
        'createdBy.id AS created_by_id',
        'createdBy.firstName AS created_by_firstname',
        'createdBy.lastName AS created_by_lastname',
        'createdBy.profilePicture AS created_by_profile_picture',
        'updatedBy.id AS updated_by_id',
        'updatedBy.firstName AS updated_by_first_name',
        'updatedBy.lastName AS updated_by_last_name',
        'updatedBy.profilePicture AS updated_by_profile_picture',
        'COUNT(DISTINCT user.id) AS user_count',
        'COUNT(DISTINCT application.id) AS application_count',
        'COUNT(entity.id) OVER() AS total_organizations'
      ])
      .where('entity.isArchive = false')
      .groupBy('entity.id')
      .addGroupBy('createdBy.id')
      .addGroupBy('updatedBy.id')
      // .skip(skip)
      // .take(take)
      .orderBy(order)
      .offset(skip)
      .limit(take)
    if (search) {
      query.andWhere("entity.name ILIKE :search", { search: `%${search}%` });
    }
    if (userId) {
      query.andWhere("entity.createdBy = :createdBy", { createdBy: userId });
    }
    const result = await query.getRawMany();

    const totalOrganizations: number = Number(result.length > 0 ? result[0].total_organizations : 0);

    const organizationEntities: OrganizationEntity[] = result.map(record => new OrganizationEntity({
      id: record.id,
      name: record.name,
      domain: record.domain,
      domainVerified: record.domain_verified,
      logo: record.logo,
      orgId: record.org_id,
      status: record.status,
      applicationCount: +record.application_count || 0,
      userCount: +record.user_count || 0,
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

    return [organizationEntities, totalOrganizations];
  }


  public async getOrganizationDetailsAndCount(id: number): Promise<OrganizationEntity> {
    const query = this.createQueryBuilder("entity")
      .leftJoin(MemberEntity, 'createdBy', 'entity.createdBy = createdBy.id')
      .leftJoin(MemberEntity, 'updatedBy', 'entity.updatedBy = updatedBy.id')
      .leftJoin(UserEntity, 'user', 'user.organization = entity.id')
      .leftJoin(ApplicationsEntity, 'application', 'application.organization = entity.id')
      .select([
        'entity.*',
        'createdBy.id AS created_by_id',
        'createdBy.firstName AS created_by_firstname',
        'createdBy.lastName AS created_by_lastname',
        'createdBy.profilePicture AS created_by_profile_picture',
        'updatedBy.id AS updated_by_id',
        'updatedBy.firstName AS updated_by_first_name',
        'updatedBy.lastName AS updated_by_last_name',
        'updatedBy.profilePicture AS updated_by_profile_picture',
        'COUNT(DISTINCT user.id) AS user_count',
        'COUNT(DISTINCT application.id) AS application_count'
      ])
      .where('entity.id = :id', { id })
      .groupBy('entity.id')
      .addGroupBy('createdBy.id')
      .addGroupBy('updatedBy.id')

    const result = await query.getRawOne();

    if (!result) {
      return undefined;
    }
    
    return new OrganizationEntity({
      id: result.id,
      name: result.name,
      domain: result.domain,
      domainVerified: result.domain_verified,
      logo: result.logo,
      orgId: result.org_id,
      status: result.status,
      hasOwner: result.has_owner,
      applicationCount: +result.application_count || 0,
      userCount: +result.user_count || 0,
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
      }
    });
  }


  public async searchByName(organizationDto: FilterOrganizationRequestDto): Promise<OrganizationEntity> {
    return this.createQueryBuilder('organization')
      .where('LOWER(TRIM(organization.name)) = LOWER(:name)', { name: organizationDto.name.trim() })
      .andWhere('organization.createdBy = :createdBy', { createdBy: organizationDto.createdBy })
      .getOne();
  }

}

