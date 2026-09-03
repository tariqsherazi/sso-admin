import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GlobalRoles } from '../common';


@Injectable()
export class OrganizationFilterGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user?.userData?.role?.name === GlobalRoles.MasterRole) {
      request.query.userId = user.id;
      return true;
    }
    return false;
  }
}
