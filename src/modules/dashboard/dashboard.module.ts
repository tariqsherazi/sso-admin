import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { MembersModule } from "../members/member.module";
import { OrganizationModule } from "../organizations/organization.module";
import { UsersModule } from "../users/users.module";
import { ApplicationsModule } from "../applications/applications.module";

@Module({
	imports: [MembersModule, OrganizationModule, UsersModule, ApplicationsModule],
	controllers: [DashboardController],
	providers: [DashboardService],
	exports: [],
})
export class DashboardModule { }
