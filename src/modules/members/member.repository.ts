import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PaginationRequest } from "../../common";
import { MemberEntity } from "../../database/entities/member.entity";
import { MemberFilterParams } from "./_types";

@Injectable()
export class MemberRepository extends Repository<MemberEntity> {
  constructor(private dataSource: DataSource) {
    super(MemberEntity, dataSource.createEntityManager());
  }

  /**
   * Get members list
   * @param pagination {PaginationRequest}
   * @returns [memberEntities: MemberEntity[], total: number]
   */
  public async getMembersAndCount(pagination: PaginationRequest<MemberFilterParams>):
    Promise<[memberEntities: MemberEntity[], total: number]> {
    const {
      skip, limit: take, order, params: { search, userId, organizationIds },
    } = pagination;

    const query = this.createQueryBuilder("u")
      // .innerJoinAndSelect("u.role", "r", roleId ? `r.id = ${roleId}` : "")
      .leftJoinAndSelect("u.role", "r")
      .leftJoinAndSelect('u.organization', 'o')
      .select([
        'u',
        'r',
        'o'
      ])
      .skip(skip)
      .take(take)
      .orderBy(order)
      .where('u.id <> :userId', { userId })

    if (search) {
      query.where(
        `u.username ILIKE :search
        OR u.email ILIKE :search
        OR u.first_name ILIKE :search
        OR u.last_name ILIKE :search
        OR r.name ILIKE :search
        `,
        { search: `%${search}%` },
      );
    }
    if (organizationIds?.length) {
      query.andWhere("u.organization IN (:...organizationIds)", { organizationIds });
    } else {
      // When organizationIds is empty, ensure the query returns nothing
      query.andWhere("1 = 0");
    }
    return query.getManyAndCount();
  }
}
