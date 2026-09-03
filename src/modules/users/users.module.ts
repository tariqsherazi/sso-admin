import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../database/entities/user.entity";
import { UsersRepository } from "./users.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { EmailModule } from "../../../src/external/email/email.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule { }
