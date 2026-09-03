import { Controller, Get, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiDocument, GlobalRoles } from "../../common";
import { DashboardService } from "./dashboard.service";
import { DashboardResponseDto, UserLogsHistoryDto } from "./_types";
import { MemberResponseDto } from "../members/_types";
import { TOKEN_NAME } from "../../config";

@ApiTags("Dashboard")
@ApiBearerAuth(TOKEN_NAME)
@Controller({ path: "dashboard", version: "1" })
export class DashboardController {
  static sampleDashboardData: DashboardResponseDto[] = [
    { header: "Total Organizations", count: 0, key: "total_organizations" },
    { header: "Total Applications", count: 0, key: "total_applications" },
    { header: "Active Users", count: 0, key: "active_users" },
    { header: "Total Users", count: 0, key: "total_users" },
  ];

  constructor(
    private dashboardService: DashboardService,
  ) { }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Request to get the total counts of dashboard overview tiles",
    responseDescription: "Total counts for different headers returned successfully",
    returnDataExample: DashboardController.sampleDashboardData,
    errorResponses: [401, 403]
  })
  @Get('/overview')
  async getDashboardMetrics(@Request() req: any): Promise<DashboardResponseDto[]> {
    const userData = req.user?.userData as MemberResponseDto
    if (!userData) return DashboardController.sampleDashboardData;

    if (userData.role?.name === GlobalRoles.MasterRole)
      return this.dashboardService.getDashboardMetricsForMaster(req.user.id);
    else
      return this.dashboardService.getDashboardMetricsForOrganization(userData?.organization?.id);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Request to get Users logs",
    responseDescription: "Users logs fatched successfully",
    returnDataDto: UserLogsHistoryDto,
    errorResponses: [400, 401]
  })
  @Get("/user-logs")
  userLoginHistry(): Promise<UserLogsHistoryDto[]> {
    return this.dashboardService.userLogsHistry();
  }
} 
