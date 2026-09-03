import {
	InternalServerErrorException, RequestTimeoutException, NotFoundException, Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TimeoutError } from "rxjs";
import {
	Pagination, PaginationResponseDto, PaginationRequest, PaginationFilters,
} from "../../common";
import {
	PermissionMapper, CreatePermissionRequestDto, UpdatePermissionRequestDto, PermissionResponseDto,
	ArchivePermissionRequestDto,
} from "./_types";
import { PermissionsRepository } from "./permissions.repository";
import { UsersService } from "../users/users.service";

@Injectable()
export class PermissionsService {
	constructor(
		@InjectRepository(PermissionsRepository)
		private permissionsRepository: PermissionsRepository,
		private userService: UsersService
	) { }

	/**
	 * Get a paginated permission list
	 * @param pagination {PaginationRequest}
	 * @returns {Promise<PaginationResponseDto<PermissionResponseDto>>}
	 */
	public async getUserPermissions(pagination: PaginationRequest<PaginationFilters>, userId?: number)
		: Promise<PaginationResponseDto<PermissionResponseDto>> {
		try {
			const [[permissionEntities, totalPermissions], userRolesPermissions, userPermissions] =
				await Promise.all([
					this.permissionsRepository.getPermissionsAndCount(pagination),
					this.userService.getUserRolePermissions(userId),
					this.userService.getUserPermission(userId)
				]);

			const userAllPermissions = userRolesPermissions.concat(userPermissions);

			let permissionDtos = await Promise.all(permissionEntities.map(PermissionMapper.toDto));
			permissionDtos = permissionDtos.map(dto => {
				dto.isSelected = userAllPermissions.some(p => dto.id === p.id);
				dto.isEditable = !userRolesPermissions.some(p => dto.id === p.id);
				return dto;
			})
			return Pagination.of(pagination, totalPermissions, permissionDtos);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException();
			}
			if (error instanceof TimeoutError) {
				throw new RequestTimeoutException();
			} else {
				throw new InternalServerErrorException();
			}
		}
	}

	public async getPermissions(pagination: PaginationRequest<PaginationFilters>)
		: Promise<PaginationResponseDto<PermissionResponseDto>> {
		try {
			const [permissionEntities, totalPermissions] = await this.permissionsRepository.getPermissionsAndCount(pagination)
			const permissionDtos = await Promise.all(permissionEntities.map(PermissionMapper.toDto));
			return Pagination.of(pagination, totalPermissions, permissionDtos);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException();
			}
			if (error instanceof TimeoutError) {
				throw new RequestTimeoutException();
			} else {
				throw new InternalServerErrorException();
			}
		}
	}
	/**
	 * Get permission by id
	 * @param id {number}
	 * @returns {Promise<PermissionResponseDto>}
	 */
	public async getPermissionById(id: number): Promise<PermissionResponseDto> {
		const permissionEntity = await this.permissionsRepository.findOne({ where: { id } });
		if (!permissionEntity) {
			throw new NotFoundException();
		}

		return PermissionMapper.toDto(permissionEntity);
	}

	/**
	 * Create new permission
	 * @param permissionDto {CreatePermissionRequestDto}
	 * @returns {Promise<PermissionResponseDto>}
	 */
	public async createPermission(permissionDto: CreatePermissionRequestDto): Promise<PermissionResponseDto> {
		let permissionEntity = PermissionMapper.toCreateEntity(permissionDto);
		permissionEntity = await this.permissionsRepository.save(permissionEntity);
		return PermissionMapper.toDto(permissionEntity);
	}

	/**
	 * Update permission by id
	 * @param id {number}
	 * @param permissionDto {UpdatePermissionRequestDto}
	 * @returns {Promise<PermissionResponseDto>}
	 */
	public async updatePermission(id: number, permissionDto: Partial<UpdatePermissionRequestDto>):
		Promise<PermissionResponseDto> {
		let permissionEntity = await this.permissionsRepository.findOne({ where: { appId: id } });
		if (!permissionEntity) {
			throw new NotFoundException(`Permission with id=${id} cannot be found`);
		}

		permissionEntity = PermissionMapper.toUpdateEntity(permissionEntity, permissionDto);
		permissionEntity = await this.permissionsRepository.save(permissionEntity);
		return PermissionMapper.toDto(permissionEntity);
	}

	public async archivePermision(archiveDto: ArchivePermissionRequestDto): Promise<PermissionResponseDto> {
		let permissiontoEntity = await this.permissionsRepository.findOne({ where: { appId: archiveDto.id, isArchive: false } });
		if (!permissiontoEntity) {
			throw new NotFoundException(`permission with id=${archiveDto.id} cannot be found in system`);
		}

		permissiontoEntity = PermissionMapper.toArchiveEntity(permissiontoEntity, { deletedBy: archiveDto.deletedBy, isArchive: true });
		permissiontoEntity = await this.permissionsRepository.save(permissiontoEntity);
		await this.permissionsRepository.softDelete({ id: permissiontoEntity.id });
		return PermissionMapper.toDto(permissiontoEntity);
	}
}
