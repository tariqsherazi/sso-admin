import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArchiveOrganizationRequestDto, CreateOrganizationRequestDto, UpdateOrganizationRequestDto, OrganizationResponseDto, OrganizationMapper, OrganizationDetailsResponseDto, FilterOrganizationRequestDto } from './_types';
import { Pagination, PaginationFilters, PaginationRequest, PaginationResponseDto } from '../../common';
import { OrganizationRepository } from './organization.reponsitory';
import { OrganizationEntity } from '../../database/entities/organization.entity';
// import { UsersService } from '../users/users.service';
// import { MemberService } from '../members/member.service';
// import { ApplicationsService } from '../applications/applications.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
    // private applicationService: ApplicationsService,
    // private memberService: MemberService,
    // private UserService: UsersService,
  ) { }

  async createOrganziation(organizationDto: CreateOrganizationRequestDto): Promise<OrganizationResponseDto> {
    let exist = await this.organizationRepository.searchByName(organizationDto)
    if (exist) throw new ConflictException(`Already exist ${organizationDto.name} `)
    let organization = OrganizationMapper.toCreateEntity(organizationDto);
    organization = await this.organizationRepository.save(organization);
    return OrganizationMapper.toDto(organization);
  }

  /**
    * Get a paginated organization list
    * @param pagination {PaginationRequest}
    * @returns {Promise<PaginationResponseDto<OrganizationResponseDto>>}
    */
  public async getOrganziations(pagination: PaginationRequest<PaginationFilters>): Promise<PaginationResponseDto<OrganizationResponseDto>> {
    const [organizationEntities, totalOrganizations] = await this.organizationRepository.getOrganizationAndCount(
      pagination,
    );
    const organizationDtos = await Promise.all(organizationEntities.map(OrganizationMapper.toDto));

    return Pagination.of(pagination, totalOrganizations, organizationDtos);
  }

  public async getOrganziationsByCreator(memberId: number): Promise<OrganizationEntity[]> {
    return this.organizationRepository.find({ where: { isArchive: false, createdBy: memberId as any } });
  }

  // ************* Fetch Organization Details By Id ************
  public async getOrganziationById(id: number): Promise<OrganizationDetailsResponseDto> {
    const organizationEntity = await this.organizationRepository.getOrganizationDetailsAndCount(id);
    if (!organizationEntity) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }    
    const organizationDto = OrganizationMapper.toDetailsDto(organizationEntity);
    return organizationDto;
  }

  public async updateOrganization(id: number, organizationDto: UpdateOrganizationRequestDto): Promise<OrganizationResponseDto> {
    let organizationEntity = await this.organizationRepository.findOne({ where: { id, isArchive: false } });
    if (!organizationEntity) {
      throw new NotFoundException(`organization with id=${id} cannot be found in system`);
    }
    // if (organizationDto.status && organizationDto.status !== organizationEntity.status) {
    //   this.applicationService.changeApplicatonStatusByOrganizatoin({ organizationId: id, status: organizationDto.status });
    //   this.memberService.changeMemberStatusByOrganizatoin({ organizationId: id, status: organizationDto.status as any });
    //   this.UserService.changeUsreStatusByOrganizatoin({ organizationId: id, status: organizationDto.status as any });
    // }
    if (organizationDto.name) {
      let exist = await this.organizationRepository.searchByName({ ...organizationDto, createdBy: +organizationEntity.createdBy })
      if (exist && exist?.id != organizationEntity.id) throw new ConflictException(`Already exist ${organizationDto.name} `)
    }
    organizationEntity = OrganizationMapper.toUpdateEntity(organizationEntity, organizationDto);
    organizationEntity = await this.organizationRepository.save(organizationEntity);
    return OrganizationMapper.toDto(organizationEntity);
  }

  public async archiveOrganization(archiveDto: ArchiveOrganizationRequestDto): Promise<OrganizationResponseDto> {
    // let organizationEntity = await this.organizationRepository.findOne({ where: { id: archiveDto.id, isArchive: false } });
    let organizationEntity = await this.organizationRepository.getOrganizationDetailsAndCount(archiveDto.id);
    organizationEntity['createdBy'] = organizationEntity?.createdBy?.id as any
    organizationEntity['updatedBy'] = organizationEntity?.updatedBy?.id as any
    if (!organizationEntity) {
      throw new NotFoundException(`organization with id=${archiveDto.id} cannot be found in system`);
    } else if (organizationEntity?.userCount > 0 || organizationEntity?.applicationCount > 0)
      throw new UnauthorizedException("You cannot delete the organization because it has associated users or applications.");

    organizationEntity = OrganizationMapper.toArchiveEntity(organizationEntity, { deletedBy: archiveDto.deletedBy, isArchive: true });
    organizationEntity = await this.organizationRepository.save(organizationEntity);
    await this.organizationRepository.softDelete({ id: organizationEntity.id });
    return OrganizationMapper.toDto(organizationEntity);
  }


  public async updateOrganizationOwner(orgId: number, status: boolean): Promise<boolean> {
    let organizationExist = await this.organizationRepository.findOne({ where: { id: orgId } })
    if (!organizationExist) {
      throw new NotFoundException(`organization with id=${orgId} cannot be found in system`);
    }
    organizationExist['hasOwner'] = status;
    this.organizationRepository.save(organizationExist);
    return true;
  }


  public async addHasOwnerToken(orgId: number, value: string | null): Promise<boolean> {
    let organizationExist = await this.organizationRepository.findOne({ where: { id: orgId } })
    if (!organizationExist) {
      throw new NotFoundException(`organization with id=${orgId} cannot be found in system`);
    }
    organizationExist['hasOwnerToken'] = value;
    this.organizationRepository.save(organizationExist);
    return true;
  }

  public async verifyHasOwnerToken(token: string): Promise<string> {
    let organizationExist = await this.organizationRepository.findOne({ where: {hasOwnerToken: token} })
    if (!organizationExist) {
      throw new NotFoundException(`organization with token cannot be found in system`);
    }
    return organizationExist.hasOwnerToken;
  }

}
