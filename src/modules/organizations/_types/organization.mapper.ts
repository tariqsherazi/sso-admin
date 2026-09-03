import { OrganizationEntity } from "../../../database/entities/organization.entity";
import { generateAvatar } from "../../../common";
import { UserDataDTO } from "../../../database/_types";
import { ArchiveOrganizationRequestDto, CreateOrganizationRequestDto, UpdateOrganizationRequestDto } from "./organization.request.dtos";
import { OrganizationDetailsResponseDto, OrganizationResponseDto } from "./organization.reponse.dtos";

export class OrganizationMapper {
	public static toCreateEntity(dto: CreateOrganizationRequestDto): OrganizationEntity {
		const entity = new OrganizationEntity();
		entity.name = dto.name;
		entity.domain = dto.domain;
		entity.status = dto.status
		if (dto.createdBy) {
			entity.createdBy = dto.createdBy as any;
		}
		entity.logo = generateAvatar(dto.name)
		entity.domainVerified = true;
		return entity;
	}

	public static toDto(entity: OrganizationEntity): OrganizationResponseDto {
		const dto = new OrganizationResponseDto();
		dto.id = entity.id;
		dto.name = entity.name;
		dto.domain = entity.domain;
		dto.applicationCount = entity.applicationCount;
		dto.userCount = entity.userCount;
		dto.status = entity.status;
		dto.createdAt = entity.createdAt?.toISOString();
		dto.logo = entity.logo;
		dto.domainVerified = entity.domainVerified;
		dto.createdBy = entity.createdBy?.id ? entity.createdBy : null
		dto.updatedBy = entity.updatedBy?.id ? entity.updatedBy : null

		return dto;
	}

	public static toDetailsDto(entity: OrganizationEntity): OrganizationDetailsResponseDto {
		const dto = new OrganizationDetailsResponseDto();
		dto.id = entity.id;
		dto.name = entity.name;
		dto.domain = entity.domain;
		dto.applicationCount =  entity.applicationCount;
		dto.userCount =   entity.userCount;
		dto.domainVerified = entity.domainVerified;
		dto.orgId = entity.orgId
		dto.hasOwner = entity.hasOwner;
		dto.logo = entity.logo
		dto.createdAt = entity.createdAt?.toISOString();
		dto.updatedAt = entity.updatedAt?.toISOString();
		dto.createdBy = entity.createdBy?.id ? entity.createdBy : null
		dto.updatedBy = entity.updatedBy?.id ? entity.updatedBy : null
		dto.status = entity.status;
		dto.hasOwner = entity.hasOwner as any;

		return dto;
	}

	public static toUpdateEntity(entity: OrganizationEntity, dto: Partial<UpdateOrganizationRequestDto>): OrganizationEntity {
		const updatedEntity = new OrganizationEntity(entity);

		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});

		return updatedEntity;
	}

	public static toArchiveEntity(entity: OrganizationEntity, dto: Partial<ArchiveOrganizationRequestDto>): OrganizationEntity {
		const updatedEntity = new OrganizationEntity(entity);

		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});
		return updatedEntity;
	}

}
