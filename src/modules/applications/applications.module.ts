import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsEntity } from '../../database/entities/application.entity';
import { ApplicationRepository } from './application.reponsitry';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationsEntity]), PermissionsModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationRepository],
  exports: [ApplicationsService]
})
export class ApplicationsModule { }
