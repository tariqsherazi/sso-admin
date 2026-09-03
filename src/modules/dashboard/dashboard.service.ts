import { Injectable } from "@nestjs/common";
import { MemberService } from "../members/member.service";
import { DashboardResponseDto, UserLogsHistoryDto } from "./_types";
import { UsersService } from "../users/users.service";
import { OrganizationsService } from "../organizations/organization.service";
import { ApplicationsService } from "../applications/applications.service";

@Injectable()
export class DashboardService {
  constructor(
    private memberService: MemberService,
    private userService: UsersService,
    private organizationservice: OrganizationsService,
    private applicationService: ApplicationsService
  ) { }

  async calculateDashboardMetrics(organizationIds: number[]) {
    const [membersCount, applicationsCount, totalUsers, activeUsers] = await Promise.all([
      this.memberService.countMembersByOrganizaions(organizationIds),
      this.applicationService.countApplicationsByOrganizaions(organizationIds),
      this.userService.countUsersByOrganizaions(organizationIds),
      this.userService.countUsersByOrganizaions(organizationIds, true),
    ]);
    return { membersCount, applicationsCount, totalUsers, activeUsers };
  }

  async getDashboardMetricsForMaster(masterId: number): Promise<DashboardResponseDto[]> {
    const masterOrganizations = await this.organizationservice.getOrganziationsByCreator(masterId);
    const { activeUsers, totalUsers, applicationsCount } = await this.calculateDashboardMetrics(masterOrganizations.map(o => o.id));

    return [
      { header: "Total Organizations", count: masterOrganizations.length, key: "total_organizations" },
      { header: "Total Applications", count: applicationsCount, key: "total_applications" },
      { header: "Total Users", count: totalUsers, key: "total_users" },
      { header: "Active Users", count: activeUsers, key: "active_users" },
    ];
  }

  async getDashboardMetricsForOrganization(organizationId: number): Promise<DashboardResponseDto[]> {
    const { activeUsers, totalUsers, applicationsCount, membersCount } = await this.calculateDashboardMetrics([organizationId]);

    return [
      { header: "Total Members", count: membersCount, key: "total_members" },
      { header: "Total Applications", count: applicationsCount, key: "total_applications" },
      { header: "Total Users", count: totalUsers, key: "total_users" },
      { header: "Active Users", count: activeUsers, key: "active_users" },
    ];
  }


  public async userLogsHistry(): Promise<UserLogsHistoryDto[]> {
    return Promise.resolve([
      {
        email: 'TariqkhanSherazi@gmail.com',
        username: 'tariq.khan',
        firstName: 'Tariq',
        lastName: 'Sherazi',
        lastLoggedIn: '2024-08-22T09:15:00Z',
      },
      {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        lastLoggedIn: '2024-08-21T08:30:00Z',
      },
      {
        email: 'michael.johnson@example.com',
        username: 'mjohnson',
        firstName: 'Michael',
        lastName: 'Johnson',
        lastLoggedIn: '2024-08-20T19:45:00Z',
      },
      {
        email: 'emily.davis@example.com',
        username: 'emilyd',
        firstName: 'Emily',
        lastName: 'Davis',
        lastLoggedIn: '2024-08-19T14:00:00Z',
      },
    ])
  }
}
