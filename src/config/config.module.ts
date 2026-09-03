import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateConfigurations } from "./config.validation";
import { registerConfgurationSecrets } from "./secrets.config";
import { registerDatabaseConfiguration } from "./database.config";

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: false,
			isGlobal: true,
			envFilePath: ".env",
			load: [registerConfgurationSecrets, registerDatabaseConfiguration],
			validate: validateConfigurations,
		}),
	],
})
export class configurationModule { }
