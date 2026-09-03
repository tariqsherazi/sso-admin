import { Module } from "@nestjs/common";
import { OrganizationsService } from './organization.service';
import { OrganizationsController } from './organization.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationEntity } from "../../database/entities/organization.entity";
import { OrganizationRepository } from "./organization.reponsitory";
import { ApplicationsModule } from "../applications/applications.module";
import { MembersModule } from "../members/member.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity])],
  providers: [OrganizationsService, OrganizationRepository],
  controllers: [OrganizationsController],
  exports: [OrganizationsService]
})
export class OrganizationModule { }
