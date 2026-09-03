import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberRepository } from "./member.repository";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { MemberEntity } from "../../database/entities/member.entity";
import { OrganizationModule } from "../organizations/organization.module";

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity]), OrganizationModule],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService],
})
export class MembersModule { }
