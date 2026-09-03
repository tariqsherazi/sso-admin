import { OrganizationEntity } from "src/database/entities/organization.entity";
import { PermissionEntity } from "../../../database/entities/permission.entity";
import { ArchivePermissionRequestDto, CreatePermissionRequestDto, UpdatePermissionRequestDto } from "./permission.request.dtos";
import { PermissionResponseDto, PermissionDto } from "./permission.response.dtos";

export class PermissionMapper {
	public static toInternalDto(entity: PermissionEntity): PermissionDto {
		const dto = new PermissionDto();
		dto.slug = entity.slug;
		dto.description = entity.description;
		dto.name = entity.name;
		dto.id = entity.id;
		return dto;
	}

	public static toDto(entity: PermissionEntity): PermissionResponseDto {
		const dto = new PermissionResponseDto();
		dto.name = entity.name;
		dto.description = entity.description;
		dto.id = entity.id;
		dto.slug = entity.slug;
		dto.active = !entity.isArchive;
		dto.createdBy = !entity.createdBy?.id ? null : entity.createdBy;
		dto.updatedBy = !entity.updatedBy?.id ? null : entity.updatedBy;
		return dto;
	}

	public static toCreateEntity(dto: CreatePermissionRequestDto): PermissionEntity {
		const entity = new PermissionEntity();
		entity.slug = dto.slug;
		entity.name = dto.name;
		entity.appId = dto.appId;
		entity.description = dto.description;
		entity.isArchive = false;
		if (dto.organization) {
			entity.organization = dto.organization as any;
		}
		entity.createdBy = dto.createdBy as any;
		return entity;
	}

	public static toUpdateEntity(entity: PermissionEntity, dto: Partial<UpdatePermissionRequestDto>): PermissionEntity {
		const updated = new PermissionEntity(entity);
		Object.keys(dto).forEach((key) => {
			updated[key] = dto[key];
		});
		return updated;
	}

	public static toArchiveEntity(entity: PermissionEntity, dto: Partial<ArchivePermissionRequestDto>): PermissionEntity {
		const updatedEntity = new PermissionEntity(entity);

		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});
		return updatedEntity;
	}
}
