import { Injectable, CanActivate, ExecutionContext, BadRequestException, ForbiddenException } from '@nestjs/common';
import { GlobalRoles } from '../common';
import { RolesService } from '../modules/roles/roles.service';

@Injectable()
export class InviteMemberGuard implements CanActivate {
  constructor(private readonly roleService: RolesService) { }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    if (!request.body?.role && currentUser?.userData?.role?.name === GlobalRoles.MasterRole) {
      let ownerRoleData = await this.roleService.getRole(GlobalRoles.Owner);
      if (!ownerRoleData) {
        return false;
      }
      request.body = { ...request.body, role: ownerRoleData.id, roleName: ownerRoleData.name };
      return true;
    } else {
      if (!request.body.role) {
        throw new BadRequestException("role is required and should be a numeric id");
      } else {
        let assignedRole = await this.roleService.getRoleById(request.body.role);

        if (assignedRole.name == GlobalRoles.MasterRole || assignedRole.name == GlobalRoles.Owner)
          throw new ForbiddenException("You are not authorized to invite a member with mentioned role");
        request.body = { ...request.body, role: assignedRole.id, roleName: assignedRole.name };
        return true;
      }
    }
  }
}
