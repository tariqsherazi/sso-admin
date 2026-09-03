import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../../modules/users/users.module";
import { RoleEntity } from "../../database/entities/role.entity";
import { RolesController } from "./roles.controller";
import { RolesRepository } from "./roles.repository";
import { RolesService } from "./roles.service";
import { OrganizationModule } from "../organizations/organization.module";
import { MembersModule } from "../members/member.module";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), UsersModule, OrganizationModule, MembersModule],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService]
})
export class RolesModule { }
