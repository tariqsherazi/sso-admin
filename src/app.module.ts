import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard, PermissionsGuard } from "./guards";
import { RolesModule } from "./modules/roles/roles.module";
import { AllExceptionsFilter, ApiLogger } from "./common";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { configurationModule } from "./config/config.module";
import { PermissionsModule } from "./modules/permissions/permissions.module";
import { ExternalAppsModule } from "./external/external.module";
import { OrganizationModule } from "./modules/organizations/organization.module";
import { ApplicationsModule } from './modules/applications/applications.module';
import { MembersModule } from "./modules/members/member.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
    imports: [
        configurationModule,
        DatabaseModule,
        ExternalAppsModule,
        AuthModule,
        UsersModule,
        PermissionsModule,
        RolesModule,
        OrganizationModule,
        ApplicationsModule,
        MembersModule,
        DashboardModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        }, {
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(ApiLogger).forRoutes("*");
    }
}
