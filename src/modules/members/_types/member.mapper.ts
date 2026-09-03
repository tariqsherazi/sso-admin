import { MemberEntity } from "../../../database/entities/member.entity";
import {  generateUserAvatar } from "../../../common";
import { PermissionDto, PermissionMapper } from "../../permissions/_types";
import { RoleEntity } from "../../../database/entities/role.entity";
import { RoleMapper } from "../../roles/_types";
import { CreateMemberRequestDto, UpdateMemberRequestDto } from "./member.request.dtos";
import { ArchiveMemberRequestDto, MemberResponseDto } from "./member.response.dtos";
import { OrganizationEntity } from "../../../database/entities/organization.entity";

async function fetchMemberPermissions(entity: MemberEntity): Promise<PermissionDto[]> {
	const memberPermissions: PermissionDto[] = [];
	if (entity?.role?.permissions)
		await Promise.all((await entity.role.permissions).map((permission) => {
			const per: PermissionDto = PermissionMapper.toInternalDto(permission);
			if (!memberPermissions.find((p) => p.slug === per.slug)) memberPermissions.push(per);
			return permission;
		}));

	return memberPermissions;
}

export class MemberMapper {
	public static async toDto(entity: MemberEntity): Promise<MemberResponseDto> {
		const dto = new MemberResponseDto();

		dto.id = entity.id;
		dto.firstName = entity.firstName;
		dto.lastName = entity.lastName;
		dto.organization = !entity?.organization?.id ? null : { id: entity.organization?.id, name: entity.organization?.name, domain: entity.organization?.domain, logo: entity.organization?.logo };
		dto.timezone = entity.timezone;
		dto.status = entity.status;
		dto.username = entity.username;
		dto.email = entity.email;
		dto.profilePicture = entity.profilePicture;
		dto.lastLoggedIn = entity.lastLoggedIn?.toISOString();
		dto.role = await RoleMapper.toInternalDto(entity.role);
		dto.permissions = await fetchMemberPermissions(entity);
		return dto;
	}

	public static async toDtoWithRelations(entity: MemberEntity): Promise<MemberResponseDto> {

		const dto = new MemberResponseDto();
		dto.email = entity.email;
		dto.firstName = entity.firstName;
		dto.lastName = entity.lastName;
		dto.phone = entity.phone;
		dto.organization = !entity?.organization?.id ? null : { id: entity?.organization?.id, name: entity?.organization?.name, domain: entity?.organization?.domain, logo: entity?.organization?.logo };
		dto.timezone = entity.timezone;
		dto.profilePicture = entity.profilePicture;
		dto.lastLoggedIn = entity.lastLoggedIn?.toISOString();
		dto.role = await RoleMapper.toInternalDto(entity.role);
		dto.status = entity.status;
		dto.lastLoggedIn = entity.lastLoggedIn?.toISOString();
		dto.id = entity.id;
		dto.username = entity.username;
		dto.phone = entity.phone;
		dto.profilePicture = entity.profilePicture;
		dto.timezone = entity.timezone;
		dto.emailVerified = entity.emailVerified;
		dto.createdAt = entity.createdAt?.toISOString();
		dto.updatedAt = entity.updatedAt?.toISOString();
		dto.permissions = await fetchMemberPermissions(entity);
		return dto;
	}

	public static toCreateEntity(dto: CreateMemberRequestDto): MemberEntity {
		const entity = new MemberEntity();
		entity.emailVerified = true;
		entity.profilePicture = generateUserAvatar(`${dto.firstName} ${dto.lastName}`); 
		entity.organization = new OrganizationEntity({ id: dto.organization });
		Object.keys(dto).forEach((key) => {
			switch (key) {
				case "role":
					entity.role = new RoleEntity({ id: dto.role });
					break;

				default:
					entity[key] = dto[key];
					break;
			}
		});
		return entity;
	}

	public static toUpdateEntity(entity: MemberEntity, dto: Partial<UpdateMemberRequestDto>): MemberEntity {
		const updatedEntity = new MemberEntity(entity);

		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});
		return updatedEntity;
	}

	public static toArchiveEntity(entity: MemberEntity, dto: Partial<ArchiveMemberRequestDto>): MemberEntity {
		const updatedEntity = new MemberEntity(entity);

		Object.keys(dto).forEach((key) => {
			updatedEntity[key] = dto[key];
		});
		return updatedEntity;
	}

	public static async toDeleteDto(entity: MemberEntity): Promise<MemberResponseDto> {
		const dto = new MemberResponseDto();
		dto.id = entity.id;
		dto.email = entity.email;
		dto.username = entity.username;
		dto.firstName = entity.firstName;
		dto.lastName = entity.lastName;
		return dto;
	}
}
