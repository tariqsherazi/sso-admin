import { ApiProperty } from "@nestjs/swagger";

export type DashboardHeaders = "Total Applications" | "Total Users" | "Active Users" | "Total Organizations" | "Total Members";

export class DashboardResponseDto {
	@ApiProperty({ name: "header" })
	header: DashboardHeaders;

	@ApiProperty({ name: "count" })
	count: number;

	@ApiProperty({ name: "key", example: "total_users" })
	key: string;
}

export class UserLogsHistoryDto {
	@ApiProperty({
		description: 'Email address of the user',
		example: 'john.doe@example.com',
	})
	email: string;

	@ApiProperty({
		description: 'Username of the user',
		example: 'johndoe',
	})
	username: string;

	@ApiProperty({
		description: 'First name of the user',
		example: 'John',
	})
	firstName: string;

	@ApiProperty({
		description: 'Last name of the user',
		example: 'Doe',
	})
	lastName: string;

	@ApiProperty({
		description: 'Timestamp of the last login',
		example: '2024-08-22T09:15:00Z',
	})
	lastLoggedIn: string;
}



