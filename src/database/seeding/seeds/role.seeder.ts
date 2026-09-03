import { Factory, Seeder } from 'typeorm-seeding';
import { Logger } from '@nestjs/common';
import { RoleEntity } from '../../entities/role.entity';
import { PermissionEntity } from '../../entities/permission.entity';
import { DataSource, IsNull } from 'typeorm';
import { ROLES_DATA } from '../../seed_data/roles.data';

export default class RoleDataSeed implements Seeder {
  private logger: Logger = new Logger(RoleDataSeed.name);

  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const permissionRepository = dataSource.getRepository(PermissionEntity);
    const roleRepository = dataSource.getRepository(RoleEntity);

    for (let roleData of ROLES_DATA) {
      try {
        let roleWithPermissions = await roleRepository.findOne({ where: { name: roleData.name, organization: IsNull() }, relations: ['permissions'] });
        const rolePermissions: PermissionEntity[] = [];
        for (const permission of await roleData.permissions) {
          let existingPermission = await permissionRepository.findOne({ where: { slug: permission.slug } });
          if (!existingPermission) {
            existingPermission = permissionRepository.create(permission);
            await permissionRepository.save(existingPermission);
          }
          rolePermissions.push(existingPermission);
        }
        if (roleWithPermissions) {
          const existingPerms = await roleWithPermissions.permissions;
          roleWithPermissions.permissions = [...existingPerms, ...rolePermissions] as any;
        } else roleWithPermissions = roleRepository.create({ ...roleData, permissions: rolePermissions as any })
        await roleRepository.save(roleWithPermissions);
      } catch (error) {
        this.logger.error(`ERROR_MESSAGE: ${error.message}`);
      }
    }
  }
}