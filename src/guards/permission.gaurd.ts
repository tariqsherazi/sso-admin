import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GlobalRoles, ROUTE_PERMISSIONS } from '../common';
import { OrganizationsService } from '../modules/organizations/organization.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    private readonly logger = new Logger(PermissionsGuard.name);
    constructor(
        private reflector: Reflector,
        private organizationService: OrganizationsService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.log('PermissionsGuard invoked');
        const requiredPermissions = this.reflector.get<string[]>(ROUTE_PERMISSIONS, context.getHandler());
        if (!requiredPermissions) {
            this.logger.log('No specific permissions required for this route.');
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        if (!user?.userData?.permissions?.length) {
            this.logger.warn('Member or User permission are not properly defined.');
            throw new ForbiddenException('Access denied: Member does not have any permission assigned.');
        }
        const hasPermission = requiredPermissions?.every(permission =>
            user?.userData?.permissions?.find(userPermission => userPermission.slug === permission)
        );
        if (!hasPermission) {
            this.logger.warn('Member does not have the required permissions.');
            throw new ForbiddenException('Access denied: Member does not have the required permissions.');
        }

        if (request?.query?.organization) {
            request.query.organizationIds = [+request.query.organization]
        } else if (user?.userData?.role?.name == GlobalRoles.MasterRole) {
            const organizationCreated = await this.organizationService.getOrganziationsByCreator(user.id)
            request.query.organizationIds = organizationCreated.map(org => org.id)
        } else {
            request.query.organizationIds = [user?.userData?.organization?.id]
        }

        return true;
    }
}
