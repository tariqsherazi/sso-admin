import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PaginationFilters, PaginationRequest } from "../../common";
import { PermissionEntity } from "../../database/entities/permission.entity";
import { OrganizationEntity } from "src/database/entities/organization.entity";
import { MemberEntity } from "src/database/entities/member.entity";

@Injectable()
export class PermissionsRepository extends Repository<PermissionEntity> {
  constructor(private dataSource: DataSource) {
    super(PermissionEntity, dataSource.createEntityManager());
  }

  /**
   * Get permision list
   * @param pagination {PaginationRequest}
   * @returns permissionEntities[] and totalPermissions
   */
  // public async getPermissionsAndCount(pagination: PaginationRequest<PaginationFilters>):
  //   Promise<[permissionEntities: PermissionEntity[], totalPermissions: number]> {
  //   const {
  //     skip, limit: take, order, params: { search, organizationIds },
  //   } = pagination;
  //   const query = this.createQueryBuilder("r").skip(skip).take(take).orderBy(order);

  //   if (search) {
  //     query.where("description ILIKE :search", {
  //       search: `%${search}%`,
  //     });
  //   }

  //   if (organizationIds?.length) {
  //     query.andWhere("r.organization IN (:...organizationIds)", { organizationIds });
  //   } else {
  //     // When organizationIds is empty, ensure the query returns nothing
  //     query.andWhere("1 = 0");
  //   }
  //   return query.getManyAndCount();
  // }

  public async getPermissionsAndCount(pagination: PaginationRequest<PaginationFilters>):
    Promise<[permissionEntities: PermissionEntity[], totalPermissions: number]> {
    const {
      skip, limit: take, order, params: { search, organizationIds },
    } = pagination;
    const query = this.createQueryBuilder("r")
      .leftJoinAndSelect(MemberEntity, 'createdBy', 'r.createdBy = createdBy.id')
      .leftJoinAndSelect(MemberEntity, 'updatedBy', 'r.updatedBy = updatedBy.id')
      .leftJoinAndSelect(OrganizationEntity, 'org', 'r.organization = org.id')
      // .skip(skip).take(take).orderBy(order)
      .offset(skip)
      .limit(take)
      .orderBy(order)
      .select([
        'r.*',
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
        'COUNT(r.id) OVER() AS total_applications'

      ])
    if (search) {
      query.where("description ILIKE :search", {
        search: `%${search}%`,
      });
    }

    if (organizationIds?.length) {
      query.andWhere("r.organization IN (:...organizationIds)", { organizationIds });
    } else {
      // When organizationIds is empty, ensure the query returns nothing
      query.andWhere("1 = 0");
    }
    // return query.getManyAndCount();
    const result = await query.getRawMany();
    const totalPermissions: number = Number(result.length > 0 ? result[0].total_applications : 0);

    const entities: PermissionEntity[] = result.map((record: any) => new PermissionEntity({
      id: record.id,
      slug: record.slug,
      name: record.name,
      description: record.description,
      organization: new OrganizationEntity({ id: record.org_id, name: record.org_name, domain: record.org_name, logo: record.org_logo }),
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

    return [entities, totalPermissions];
  }
}
