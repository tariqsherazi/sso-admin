import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { GlobalRoles } from 'src/common';
import { MemberService } from 'src/modules/members/member.service';
import { OrganizationsService } from 'src/modules/organizations/organization.service';
@Injectable()
export class MemberGuard implements CanActivate {
    private readonly logger = new Logger(MemberGuard.name);
    constructor(
        private memberService: MemberService,
        private organizationService: OrganizationsService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        this.logger.log('MembersGuard invoked', request.params?.id);
        const { user } = context.switchToHttp().getRequest();
        if (request.params?.id === user?.id) throw new UnauthorizedException("You are not allowed to delete your own account.")
        let deleteMember = await this.memberService.getMemberById(request.params.id)
        if (deleteMember?.role?.name == GlobalRoles.MasterRole) throw new UnauthorizedException("You are not allowed to delete an account with a 'MasterRole'.")

        const memberOrganization = await this.organizationService.getOrganziationsByCreator(user.id)
        if (!memberOrganization?.find((x) => x.id == deleteMember?.organization?.id)) throw new UnauthorizedException("You are not allowed to delete an account that does not belong to your organization.")

        if (deleteMember?.role?.name == GlobalRoles.Owner && user.userData?.role?.name !== GlobalRoles.MasterRole)
            throw new UnauthorizedException("Only members with 'MasterRole' can delete accounts with the 'Owner' role.")
        if (deleteMember?.role?.name == GlobalRoles.Admin && (user.userData?.role?.name != GlobalRoles.MasterRole && user.userData?.role?.name != GlobalRoles.Owner && user.userData?.role?.name != GlobalRoles.Admin))
            throw new UnauthorizedException("Only members with 'MasterRole','OwnerRole'and 'AdminRole' can delete accounts with the 'Admin' role.")

        return true


    }
}