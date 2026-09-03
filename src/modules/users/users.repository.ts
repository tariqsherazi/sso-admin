import { Injectable } from "@nestjs/common";
import { UserFilterParams } from "../../modules/users/_types";
import { DataSource, Repository } from "typeorm";
import { PaginationRequest } from "../../common";
import { UserEntity } from "../../database/entities/user.entity";

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  /**
   * Get users list
   * @param pagination {PaginationRequest}
   * @returns [userEntities: UserEntity[], totalUsers: number]
   */
  public async getUsersAndCount(pagination: PaginationRequest<UserFilterParams>):
    Promise<[userEntities: UserEntity[], totalUsers: number]> {
    const {
      skip, limit: take, order, params: { search, organizationIds },
    } = pagination;

    const query = this.createQueryBuilder("u")
      // .innerJoinAndSelect("u.role", "r", roleId ? `r.id = ${roleId}` : "")
      .leftJoinAndSelect("u.permissions", "p")
      .leftJoinAndSelect('u.organization', 'o')
      .select([
        'u',
        'o.name',
        'o.domain',
        'o.id',
        'o.orgId',
      ])
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (search) {
      query.where(
        `u.username ILIKE :search
        OR u.email ILIKE :search
        OR u.first_name ILIKE :search
        OR u.last_name ILIKE :search
        `,
        { search: `%${search}%` },
      );
    }

    // if (organization) {
    //   query.andWhere("u.organization = :organization", { organization: organization }); // Filter by organization_id
    // }

    if (organizationIds?.length) {
      query.andWhere("u.organization IN (:...organizationIds)", { organizationIds });
    } else {
      // When organizationIds is empty, ensure the query returns nothing
      query.andWhere("1 = 0");
    }
    return query.getManyAndCount();
  }

  /**
   * find user by username
   * @param username {string}
   * @returns Promise<UserEntity>
   */
  async findUserByUsername(username: string): Promise<UserEntity> {
    return this.createQueryBuilder("u")
      .leftJoinAndSelect("u.roles", "r", "r.active = true")
      .leftJoinAndSelect("r.permissions", "rp", "rp.active = true")
      .leftJoinAndSelect("u.permissions", "p", "p.active = true")
      .where("u.username = :username", { username })
      .getOne();
  }
}
