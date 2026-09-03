import { PermissionEntity } from "../../../database/entities/permission.entity";
import { PermissionMapper } from "../../permissions/_types";
import { ArchiveRoleRequestDto, CreateRoleRequestDto, UpdateRoleRequestDto } from "./role.request.dtos";
import { RoleResponseDto, RoleDto, RoleInviteMemberResponseDto } from "./role.response.dto";
import { RoleEntity } from "../../../database/entities/role.entity";
import { OrganizationEntity } from "../../../database/entities/organization.entity";

export class RoleMapper {
	public static toInternalDto(entity: RoleEntity): RoleDto {
		const dto = new RoleDto();
		dto.id = entity?.id;
		dto.name = entity?.name;
		return dto;

	}

	public static async toDto(entity: RoleEntity): Promise<RoleResponseDto> {
		const dto = new RoleResponseDto();
		dto.id = entity.id;
		dto.name = entity.name;
		dto.organization = entity.organization?.id ? entity.organization : null
		dto.active = !entity.isArchive;
		return dto;
	}

	public static async toDtoWithRelations(entity: RoleEntity): Promise<RoleResponseDto> {
		const dto = new RoleResponseDto();
		dto.id = entity.id;
		dto.name = entity.name;
		dto.description = entity.description;
		dto.permissions = await Promise.all((await entity?.permissions).map(PermissionMapper.toDto));
		dto.active = !entity.isArchive;
		dto.organization = entity.organization?.id ? (await (entity.organization)) : null;
		dto.createdAt = entity.createdAt?.toISOString();
		dto.updatedAt = entity.updatedAt?.toISOString();
		dto.createdBy = entity.createdBy?.id ? entity.createdBy : null
		dto.updatedBy = entity.updatedBy?.id ? entity.updatedBy : null
		return dto;
	}

	public static toCreateEntity(dto: CreateRoleRequestDto): RoleEntity {
		const entity = new RoleEntity();
		entity.name = dto.name;
		entity.description = dto.description;
		entity.createdBy = dto.createdBy as any;
		entity.organization = new OrganizationEntity({ id: dto.organization })
		entity.permissions = Promise.resolve(dto.permissions?.map((id) => new PermissionEntity({ id })));
		entity.isArchive = false;
		return entity;
	}

	public static toUpdateEntity(entity: RoleEntity, dto: Partial<UpdateRoleRequestDto>): RoleEntity {
		const updateEntity = new RoleEntity(entity);

		if (dto.name !== undefined) updateEntity.name = dto.name;

		if (dto.permissions !== undefined) {
			updateEntity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
		}

		if (dto.active !== undefined) updateEntity.isArchive = !dto.active;
		updateEntity.description = dto.description
		updateEntity.updatedBy = dto.updatedBy as any
		return updateEntity;
	}

	public static toInviteMemberRoleDto(entity: RoleEntity): RoleInviteMemberResponseDto {
		const dto = new RoleInviteMemberResponseDto();
		dto.id = entity?.id;
		dto.name = entity?.name;
		return dto;
	}

	public static toArchiveEntity(entity: RoleEntity, dto: Partial<ArchiveRoleRequestDto>): RoleEntity {
		const updatedEntity = new RoleEntity(entity);
		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});
		return updatedEntity;
	}
}
