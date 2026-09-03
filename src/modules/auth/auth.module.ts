import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TokenService } from "../../modules/auth/token.service";
import { ExternalAppsModule } from "../../external/external.module";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Secrets } from "../../config/interfaces";
import { ConfigMapper } from "../../config";
import { MembersModule } from "../members/member.module";
import { RolesModule } from "../roles/roles.module";
import { OrganizationModule } from "../organizations/organization.module";

const jwtFactory = {
	useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
		const appConfig = configService.get<Secrets>(ConfigMapper.appConfig);
		return {
			secret: appConfig.jwtSecret,
			signOptions: { expiresIn: appConfig.jwtExpiresIn },
		};
	},
	inject: [ConfigService],
};

@Module({
	imports: [
		JwtModule.registerAsync(jwtFactory),
		PassportModule.register({ defaultStrategy: "jwt" }),
		MembersModule,
		ExternalAppsModule,
		RolesModule,
		OrganizationModule
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, TokenService],
	exports: [JwtModule, JwtStrategy, PassportModule],
})
export class AuthModule { }
