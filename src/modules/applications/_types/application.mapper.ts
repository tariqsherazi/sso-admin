import { ApplicationsEntity } from "../../../database/entities/application.entity";
import { ArchiveApplicationRequestDto, CreateApplicationRequestDto, UpdateApplicationRequestDto, ApplicationsResponseDto, appSecretUpdateRequestDto, ApplicationDetailsResponseDto } from "./index";
import { OrganizationEntity } from "../../../database/entities/organization.entity";
import { generateAvatar } from "../../../common";


export class ApplicationMapper {
	public static toCreateEntity(dto: CreateApplicationRequestDto): ApplicationsEntity {
		const entity = new ApplicationsEntity();
		entity.appName = dto.appName;
		entity.url = dto.url;
		entity.status = dto.status
		entity.redirectUri = dto.redirectUri
		if (dto.createdBy) {
			entity.createdBy = dto.createdBy as any;
		}
		if (dto.organization) {
			entity.organization = new OrganizationEntity({ id: dto.organization });
		}
		entity.logo = generateAvatar(dto.appName)
		return entity;
	}

	public static toDto(entity: ApplicationsEntity): ApplicationsResponseDto {
		const dto = new ApplicationsResponseDto();
		dto.id = entity.id;
		dto.appName = entity.appName;
		dto.organization = entity.organization?.id ? { id: entity.organization?.id, domain: entity.organization?.domain, name: entity.organization?.name } : null;
		dto.appId = entity.appId;
		dto.url = entity.url;
		dto.status = entity.status;
		dto.createdBy = entity.createdBy?.id ? entity.createdBy : null
		dto.updatedBy = entity.updatedBy?.id ? entity.updatedBy : null
		dto.createdAt = entity.createdAt?.toISOString();
		dto.updatedAt = entity.updatedAt?.toISOString();
		return dto;
	}


	public static toDetailsDto(entity: ApplicationsEntity): ApplicationDetailsResponseDto {
		const dto = new ApplicationDetailsResponseDto();
		dto.id = entity.id;
		dto.appName = entity.appName;
		dto.url = entity.url;
		dto.status = entity.status;
		dto.appId = entity.appId;
		dto.appSecret = entity.appSecret;
		dto.redirectUri = entity.redirectUri;
		dto.logo = entity.logo;
		dto.createdAt = entity.createdAt?.toISOString();
		dto.updatedAt = entity.updatedAt?.toISOString();
		dto.organization = entity.organization?.id ? { id: entity.organization.id, domain: entity.organization.domain, name: entity.organization.name } : null;
		dto.createdBy = entity.createdBy?.id ? entity.createdBy : null
		dto.updatedBy = entity.updatedBy?.id ? entity.updatedBy : null
		return dto;
	}

	public static toUpdateEntity(entity: ApplicationsEntity, dto: Partial<UpdateApplicationRequestDto>): ApplicationsEntity {
		const updatedEntity = new ApplicationsEntity(entity);

		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});

		return updatedEntity;
	}

	public static toArchiveEntity(entity: ApplicationsEntity, dto: Partial<ArchiveApplicationRequestDto>): ApplicationsEntity {
		const updatedEntity = new ApplicationsEntity(entity);

		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});
		return updatedEntity;
	}

	public static toUpdateSecret(entity: ApplicationsEntity, dto: appSecretUpdateRequestDto): ApplicationsEntity {
		const updatedEntity = new ApplicationsEntity(entity);
		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});
		return updatedEntity;
	}

}
