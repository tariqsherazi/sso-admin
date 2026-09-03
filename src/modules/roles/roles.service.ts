import { NotFoundException, Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../../modules/users/users.service";
import {
  GlobalRoles,
  Pagination, PaginationFilters, PaginationRequest, PaginationResponseDto,
} from "../../common";
import {
  CreateRoleRequestDto, UpdateRoleRequestDto, RoleResponseDto, RoleMapper,
  RoleInviteMemberResponseDto,
  ArchiveRoleRequestDto,
} from "./_types";
import { RolesRepository } from "./roles.repository";
import { In, Not } from 'typeorm';
import { MemberService } from "../members/member.service";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private rolesRepository: RolesRepository,
    private usersService: UsersService,
    private memberService: MemberService,
  ) { }

  /**
   * Get a paginated role list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<RoleResponseDto>>}
   */
  public async getRoles(pagination: PaginationRequest<PaginationFilters>): Promise<PaginationResponseDto<RoleResponseDto>> {
    const [roleEntities, totalRoles] = await this.rolesRepository.getRolesAndCount(pagination);

    const userCountPromise: Promise<number>[] = [];

    let roleDtos = await Promise.all(roleEntities.map((e) => {
      userCountPromise.push(this.usersService.countUsersByRole(e.id));
      return RoleMapper.toDtoWithRelations(e);
    }));

    const usersCountByRoles = await Promise.all(userCountPromise);

    roleDtos = roleDtos.map((r, i) => ({ ...r, userCount: usersCountByRoles[i] }));

    return Pagination.of(pagination, totalRoles, roleDtos);
  }

  /**
   * Get role by id
   * @param id {number}
   * @returns {Promise<RoleResponseDto>}
   */
  public async getRoleById(id: number): Promise<RoleResponseDto> {
    const roleEntity = await this.rolesRepository.findOne({
      where: { id }, relations: ["permissions", "organization"], select: {
        organization: { name: true, domain: true, id: true }

      }
    })
    if (roleEntity.createdBy && +roleEntity.createdBy != -1) {
      let user = await this.memberService.filter({ id: roleEntity.createdBy })
      roleEntity['createdBy'] = user && {
        firstName: user?.firstName,
        lastName: user?.lastName,
        profilePicture: user?.profilePicture,
        id: user?.id
      }
    }
    if (roleEntity?.updatedBy && +roleEntity.updatedBy != -1) {
      let user = await this.memberService.filter({ id: roleEntity.updatedBy })
      roleEntity['updatedBy'] = user && {
        firstName: user?.firstName,
        lastName: user?.lastName,
        profilePicture: user?.profilePicture,
        id: user?.id
      }
    }

    if (!roleEntity) {
      throw new NotFoundException();
    }
    return RoleMapper.toDtoWithRelations(roleEntity);
  }

  /**
   * Create new role
   * @param roleDto {CreateRoleRequestDto}
   * @returns {Promise<RoleResponseDto>}
   */
  public async createRole(roleDto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    let exist = await this.rolesRepository.searchRoleByName(roleDto)
    if (exist) throw new ConflictException(`Already exist ${roleDto.name}`)

    let roleEntity = RoleMapper.toCreateEntity(roleDto);
    roleEntity = await this.rolesRepository.save(roleEntity);
    return RoleMapper.toDto(roleEntity);
  }

  /**
   * Update role by id
   * @param id {number}
   * @param roleDto {UpdateRoleRequestDto}
   * @returns {Promise<RoleResponseDto>}
   */
  public async updateRole(id: number, roleDto: UpdateRoleRequestDto): Promise<RoleResponseDto> {
    let roleEntity = await this.rolesRepository.findOne({ where: { id } });
    if (!roleEntity) {
      throw new NotFoundException();
    }

    if (roleDto.name) {
      let exist = await this.rolesRepository.searchRoleByName(roleDto)
      if (exist && exist?.id != id) throw new ConflictException(`Already exist ${roleDto.name}`)
    }

    roleEntity = RoleMapper.toUpdateEntity(roleEntity, roleDto);
    roleEntity = await this.rolesRepository.save(roleEntity);
    return RoleMapper.toDto(roleEntity);
  }

  public async getRole(name: string): Promise<RoleResponseDto> {
    const roleEntity = await this.rolesRepository.findOne({
      where: { name }
    })
    if (!roleEntity) {
      throw new NotFoundException();
    }
    return RoleMapper.toDto(roleEntity);
  }
  // i will fix this later
  public async getInviteMemberRole(): Promise<RoleInviteMemberResponseDto[]> {
    let filter = {
      createdBy: -1 as any,
    }
    let notIn = [GlobalRoles.MasterRole, GlobalRoles.Owner]
    filter["name"] = Not(In(notIn));

    let roleEntity = await this.rolesRepository.find({
      where: filter
    })
    let roleEntitys = roleEntity.map((x) => { return RoleMapper.toInviteMemberRoleDto(x) })
    return roleEntitys;
  }

  public async deleteRole(archiveDto: ArchiveRoleRequestDto): Promise<RoleResponseDto> {
    let roleEntity = await this.rolesRepository.findOne({ where: { id: archiveDto.id, isArchive: false } });
    if (!roleEntity) {
      throw new NotFoundException(`Role with id=${archiveDto.id} cannot be found in system`);
    }
    roleEntity = RoleMapper.toArchiveEntity(roleEntity, { deletedBy: archiveDto.deletedBy, isArchive: true });
    roleEntity = await this.rolesRepository.save(roleEntity);
    await this.rolesRepository.softDelete({ id: roleEntity.id });
    return RoleMapper.toDto(roleEntity);
  }
}
