import { generateUserAvatar } from "../../../common/helpers";
import { PermissionEntity } from "../../../database/entities/permission.entity";
import { PermissionDto, PermissionMapper } from "../../permissions/_types";
import { RoleEntity } from "../../../database/entities/role.entity";
import { RoleMapper } from "../../roles/_types";
import { CreateUserRequestDto, UpdateUserRequestDto } from "./user.request.dtos";
import { UserResponseDto } from "./user.response.dtos";
import { UserEntity } from "../../../database/entities/user.entity";
import { ArchiveMemberRequestDto } from "../../members/_types";

async function fetchUserPermissions(entity: UserEntity): Promise<PermissionDto[]> {
	const userPermissions: PermissionDto[] = await Promise.all(
		(await entity.permissions).map(PermissionMapper.toInternalDto),
	);

	await Promise.all((await entity.roles).map(async (role) => {
		await Promise.all((await role.permissions).map((permission) => {
			const per: PermissionDto = PermissionMapper.toInternalDto(permission);
			if (!userPermissions.find((p) => p.slug === per.slug)) userPermissions.push(per);
			return permission;
		}));
	}));

	return userPermissions;
}

export class UserMapper {
	public static async toDto(entity: UserEntity): Promise<UserResponseDto> {
		const dto = new UserResponseDto();

		dto.id = entity.id;
		dto.firstName = entity.firstName;
		dto.lastName = entity.lastName;
		dto.organization = { id: entity?.organization?.id, domain: entity?.organization?.domain, name: entity?.organization?.name };
		dto.timezone = entity.timezone;
		return dto;
	}

	public static async toDtoWithRelations(entity: UserEntity): Promise<UserResponseDto> {
		const dto = new UserResponseDto();
		dto.email = entity.email;
		dto.firstName = entity.firstName;
		dto.lastName = entity.lastName;
		dto.organization = !entity?.organization?.id ? null : { id: entity.organization?.id, domain: entity.organization?.domain, name: entity.organization?.name };
		dto.roles = await Promise.all((await entity.roles)?.map(RoleMapper.toInternalDto));
		dto.status = entity.status;
		dto.lastLoggedIn = entity.lastLoggedIn?.toISOString();
		dto.id = entity.id;
		dto.username = entity.username;
		dto.phone = entity.phone;
		dto.profilePicture = entity.profilePicture;
		dto.timezone = entity.timezone;
		dto.permissions = await fetchUserPermissions(entity);
		dto.emailVerified = entity.emailVerified;
		dto.createdAt = entity.createdAt?.toISOString();
		dto.updatedAt = entity.updatedAt?.toISOString();
		return dto;
	}

	public static toCreateEntity(dto: CreateUserRequestDto): UserEntity {
		const entity = new UserEntity();
		entity.profilePicture = generateUserAvatar(`${dto.firstName} ${dto.lastName}`)
		Object.keys(dto).forEach((key) => {
			switch (key) {
				case "permissions":
					entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
					break;

				case "roles":
					entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
					break;

				default:
					entity[key] = dto[key];
					break;
			}
		});
		return entity;
	}

	public static toUpdateEntity(entity: UserEntity, dto: Partial<UpdateUserRequestDto>): UserEntity {
		const updatedEntity = new UserEntity(entity);

		Object.keys(dto).forEach((key) => {
			switch (key) {
				case "permissions":
					updatedEntity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
					break;

				case "roles":
					updatedEntity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
					break;

				default:
					if (dto[key] !== undefined) { updatedEntity[key] = dto[key]; }
					break;
			}
		});
		return updatedEntity;
	}


	public static toArchiveUserEntity(entity: UserEntity, dto: Partial<ArchiveMemberRequestDto>): UserEntity {
		const updateUserEnitity = new UserEntity(entity);
		Object.keys(dto).forEach(key => {
			updateUserEnitity[key] = dto[key]
		});
		return updateUserEnitity;
	}
}
