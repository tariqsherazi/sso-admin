import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { GlobalRoles } from 'src/common';
import { OrganizationsService } from 'src/modules/organizations/organization.service';
@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);
    constructor(private organizationService: OrganizationsService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        this.logger.log('RolesGuard invoked');
        const { user } = request;
        if (request?.query?.organization) {
            request.query.organizationIds = [request.query.organization]
        } else if (user?.userData?.role?.name == GlobalRoles.MasterRole) {
            const organizationCreated = await this.organizationService.getOrganziationsByCreator(user.id)
            request.query.organizationIds = organizationCreated.map(org => org.id)
        } else {
            request.query.organizationIds = [user?.userData?.organization?.id]
        }
        return true


    }
}
