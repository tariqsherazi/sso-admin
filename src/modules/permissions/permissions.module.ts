import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { PermissionEntity } from "../../database/entities/permission.entity";
import { PermissionsController } from "./permissions.controller";
import { PermissionsRepository } from "./permissions.repository";
import { PermissionsService } from "./permissions.service";
import { OrganizationModule } from "../organizations/organization.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PermissionEntity]), OrganizationModule, UsersModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsService]
})
export class PermissionsModule { }
