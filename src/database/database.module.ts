import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigMapper } from "../config";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => (
				configService.get<TypeOrmModuleOptions>(ConfigMapper.database)),
		}),
	],
})
export class DatabaseModule { }
