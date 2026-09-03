import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { GlobalRoles, PaginationFilters, PaginationRequest } from "../../common";
import { RoleEntity } from "../../database/entities/role.entity";
import { MemberEntity } from "src/database/entities/member.entity";
import { FilterRoleRequestDto } from "./_types/role.request.dtos";

@Injectable()
export class RolesRepository extends Repository<RoleEntity> {
  constructor(private dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }

  /**
   * Get roles list
   * @param pagination {PaginationRequest}
   * @returns [roleEntities: RoleEntity[], totalRoles: number]
   */
  public async getRolesAndCount(pagination: PaginationRequest<PaginationFilters>):
    Promise<[roleEntities: RoleEntity[], totalRoles: number]> {
    const {
      skip, limit: take, order, params: { search, organizationIds },
    } = pagination;
    const query = this.createQueryBuilder("r")
      // .leftJoinAndSelect("r.permissions", "p")
      // .leftJoin("r.organization", "o")
      .leftJoin(MemberEntity, 'createdBy', 'r.createdBy = createdBy.id')
      .leftJoin(MemberEntity, 'updatedBy', 'r.updatedBy = updatedBy.id')
      // .skip(skip)
      // .take(take)
      // .orderBy(order)
      .offset(skip)
      .limit(take)
      .orderBy(order)
      .select([
        'r',
        'createdBy.id AS created_by_id',
        'createdBy.firstName AS created_by_firstname',
        'createdBy.lastName AS created_by_lastname',
        'createdBy.profilePicture AS created_by_profile_picture',
        'updatedBy.id AS updated_by_id',
        'updatedBy.firstName AS updated_by_first_name',
        'updatedBy.lastName AS updated_by_last_name',
        'updatedBy.profilePicture AS updated_by_profile_picture',
        'COUNT(r.id) OVER() AS total_roles'
      ])

    if (search) {
      query.andWhere("r.name ILIKE :search", { search: `%${search}%` });
    }
    if (organizationIds?.length) {
      query.andWhere("r.organization IN (:...organizationIds)", { organizationIds });
    } else {
      // When organizationIds is empty, ensure the query returns nothing
      query.andWhere("1 = 0");
    }


    const result = await query.getRawMany();
    const totalRoles: number = Number(result.length > 0 ? result[0].total_roles : 0);
    const entities: any = result.map((record: any) => new RoleEntity({
      name: record.r_name,
      id: record.r_id,
      description: record.r_description,
      //  active:record.r_active,
      createdAt: record.r_created_at,
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
    }
    ))
    return [entities, totalRoles];


    // const rawResults = await query.getRawMany()
    // const [organizationEntities, totalOrganizations] = await query.getManyAndCount();
    // let result: RoleEntity[] = organizationEntities?.map((x) => {
    //   let count = rawResults.find((c) => c.role_id == x.id)
    //   // let c = x._doc ? x._doc : x
    //   console.log(x, "cccccc")
    //   x.createdBy = {
    //     firstName: count.createdBy_first_name,
    //     lastName: count.createdBy_last_name,
    //     id: count.createdBy_id,
    //     profilePicture: count.createdBy_profilePicture
    //   };
    //   x.updatedBy = {
    //     firstName: count.updatedBy_first_name,
    //     lastName: count.updatedBy_last_name,
    //     id: count.updatedBy_id,
    //     profilePicture: count.updatedBy_profilePicture
    //   }
    //   return x;
    //   // return {
    //   //   ...x,
    //   //   userCount: count?.userCount || 0,
    //   //   applicationCount: count?.applicationCount || 0,
    //   // }
    // }
    // )
    // return [result, totalOrganizations];
  }

  public async searchRoleByName(dto: FilterRoleRequestDto): Promise<RoleEntity> {
    return this.createQueryBuilder('r')
      .where('LOWER(TRIM(r.name)) = LOWER(:name)', { name: dto.name?.trim() })
      .andWhere('r.organization = :organization', { organization: dto.organization })
      .getOne();
  }

  public async getRoleById(id: number): Promise<RoleEntity> {
    let query = this.createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('role.organization', 'organization')
      .leftJoin(MemberEntity, 'createdBy', 'createdBy.id = role.createdBy')
      .leftJoin(MemberEntity, 'updatedBy', 'updatedBy.id = role.updatedBy')
      .addSelect([
        'role.*',
        'organization.name',
        'organization.domain',
        'organization.id',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.profilePicture',
        'updatedBy.id',
        'updatedBy.firstName',
        'updatedBy.lastName',
        'updatedBy.profilePicture'
      ])
      .where('role.id = :id', { id })
    // .getOne();
    let roleEntity = await query.getRawOne()
    console.log(roleEntity)
    if (!roleEntity) {
      // throw new NotFoundException('Role not found');
    }

    // Map the raw data into RoleResponseDto or transform as needed
    return {
      ...roleEntity,
      createdBy: {
        id: roleEntity.createdBy?.id,
        firstName: roleEntity.createdBy?.firstName,
        lastName: roleEntity.createdBy?.lastName,
        profilePicture: roleEntity.createdBy?.profilePicture,
      },
      updatedBy: {
        id: roleEntity.updatedBy?.id,
        firstName: roleEntity.updatedBy?.firstName,
        lastName: roleEntity.updatedBy?.lastName,
        profilePicture: roleEntity.updatedBy?.profilePicture,
      },
      // deletedBy: {
      //   id: roleEntity.updatedBy?.id,
      //   firstName: roleEntity.updatedBy?.firstName,
      //   lastName: roleEntity.updatedBy?.lastName,
      //   profilePicture: roleEntity.updatedBy?.profilePicture,
      // },
    }
  }
}
