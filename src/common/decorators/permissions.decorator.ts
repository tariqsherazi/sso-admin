import { SetMetadata } from '@nestjs/common';
import { ROUTE_PERMISSIONS } from '../constants';

export const RequiredPermissions = (...permissions: string[]) => SetMetadata(ROUTE_PERMISSIONS, permissions);
