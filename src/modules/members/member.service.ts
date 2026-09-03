import { NotFoundException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In } from "typeorm";
import { GlobalRoles, Pagination, PaginationRequest, PaginationResponseDto } from "../../common";
import {
  ArchiveMemberRequestDto,
  CreateMemberRequestDto,
  FindByOrganizationRequestDto,
  MemberFilterParams,
  MemberMapper,
  MemberResponseDto,
  UpdateMemberRequestDto,
} from "./_types";
import { MemberRepository } from "./member.repository";
import { MemberEntity } from "../../database/entities/member.entity";
import { OrganizationsService } from "../organizations/organization.service";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
    private origanizationService: OrganizationsService
  ) { }

  /**
   * Get a paginated members list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<MemberResponseDto>>}
   */
  public async getMembers(pagination: PaginationRequest<MemberFilterParams>)
    : Promise<PaginationResponseDto<MemberResponseDto>> {
    const [memberEntities, totalMembers] = await this.memberRepository.getMembersAndCount(pagination);

    const memberDtos = await Promise.all(memberEntities.map(MemberMapper.toDtoWithRelations));
    return Pagination.of(pagination, totalMembers, memberDtos);
  }

  /**
   * Get member by id
   * @param id {string}
   * @returns {Promise<MemberResponseDto>}
   */
  public async getMemberById(id: number): Promise<MemberResponseDto> {
    const memberEntity = await this.memberRepository.findOne({
      where: { id }, relations: ["role", "organization"],
      select: {
        organization: { name: true, domain: true, id: true, orgId: true },
      },
    });
    if (!memberEntity) {
      throw new NotFoundException();
    }

    return MemberMapper.toDtoWithRelations(memberEntity);
  }

  /**
   * Create new member
   * @param memberDto {CreateMemberRequestDto}
   * @returns {Promise<MemberResponseDto>}
   */
  public async createMember(memberDto: CreateMemberRequestDto): Promise<MemberResponseDto> {
    let memberEntity = MemberMapper.toCreateEntity(memberDto);
    memberEntity = await this.memberRepository.save(memberEntity);
    memberEntity = await this.memberRepository.findOne({ where: { id: memberEntity.id }, relations: ["organization", "role"] })
    return MemberMapper.toDtoWithRelations(memberEntity);
  }

  /**
   * Update member by id
   * @param id {id}
   * @param memberDto {UpdateMemberRequestDto}
   * @returns {Promise<MemberResponseDto>}
   */
  public async updateMember(id: number, memberDto: UpdateMemberRequestDto, user?: any): Promise<MemberResponseDto> {

    let memberEntity = await this.memberRepository.findOne({ where: { id } });
    if (!memberEntity) {
      throw new NotFoundException(`Member with id=${id} cannot be found in system`);
    }

    let updateMemberEntity = MemberMapper.toUpdateEntity(memberEntity, memberDto);
    if (id == user.id) {
      updateMemberEntity.status = memberEntity.status
    }
    memberEntity = await this.memberRepository.save(updateMemberEntity);
    return MemberMapper.toDtoWithRelations(updateMemberEntity);
  }

  public async countMembersByRole(roleId): Promise<number> {
    return this.memberRepository.countBy({ role: { id: roleId } });
  }

  public async countMembersByOrganizaions(organizationIds: number[]): Promise<number> {
    return this.memberRepository.countBy({ organization: { id: In(organizationIds) } });
  }

  public async findByEmail(email: string): Promise<MemberEntity> {
    return this.memberRepository.findOne({
      where: { email: email?.toLowerCase() }, relations: ["role", "organization"]
    });
  }

  public async updateLastLogin(entiy: MemberEntity): Promise<MemberEntity> {
    return this.memberRepository.save({ ...entiy, lastLoggedIn: new Date() });
  }



  public async findAndUpdateMember(filter: any, updateData: Partial<MemberEntity>): Promise<MemberEntity> {

    const member = await this.memberRepository.findOne({ where: filter });

    if (!member) {
      throw new Error('Member not found');
    }

    // Step 2: Merge the update data with the found entity
    const updatedMember = this.memberRepository.merge(member, updateData);

    // Step 3: Save the updated entity back to the database
    return this.memberRepository.save(updatedMember);
  }

  public async archiveMember(archiveDto: ArchiveMemberRequestDto): Promise<MemberResponseDto> {

    let membertionEntity = await this.memberRepository.findOne({ where: { id: archiveDto.id, isArchive: false }, relations: ['organization', 'role'] });
    if (!membertionEntity) {
      throw new NotFoundException(`member with id=${archiveDto.id} cannot be found in system `);
    }
    
    if (membertionEntity.organization && membertionEntity?.organization?.hasOwner === true){
      this.origanizationService.updateOrganizationOwner(membertionEntity?.organization?.id, false)
    }
    
    membertionEntity = MemberMapper.toArchiveEntity(membertionEntity, { deletedBy: archiveDto.deletedBy, isArchive: true });
    membertionEntity = await this.memberRepository.save(membertionEntity);
    await this.memberRepository.softDelete({ id: membertionEntity.id });
    return MemberMapper.toDeleteDto(membertionEntity);
  }

  public async getOne(filter: any): Promise<MemberEntity> {
    return this.memberRepository.findOne({
      where: { ...filter }, relations: ['role']
    });
  }



  public async changeMemberStatusByOrganizatoin(dto: FindByOrganizationRequestDto): Promise<MemberEntity> {
    let memberEntity = await this.memberRepository.findOne({ where: { organization: dto?.organizationId as any } })
    if (!memberEntity) {
      throw new NotFoundException(`Member with organizatoin=${dto.organizationId} cannot be found in system`);
    }
    memberEntity['status'] = dto.status;
    return this.memberRepository.save(memberEntity)
  }

  public async filter(filter: any): Promise<MemberEntity> {
    return this.memberRepository.findOne({
      where: { ...filter }, select: ['status', "firstName", "lastName", "profilePicture", "id"]
    });
  }

}
