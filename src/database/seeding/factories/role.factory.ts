import { define } from 'typeorm-seeding';
import { RoleEntity } from '../../entities/role.entity';

define(RoleEntity, (entity: RoleEntity) => new RoleEntity(entity));
