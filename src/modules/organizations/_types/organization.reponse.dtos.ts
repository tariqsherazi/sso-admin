import { ApiProperty } from "@nestjs/swagger";
import { AbstractDTO, UserDataDTO } from "../../../database/_types";
import { GeneralStatus } from "../../../database/entities/_enums";
export class OrganizationResponseDto extends AbstractDTO {

	@ApiProperty({ name: "name" })
	name: string;

	@ApiProperty({ name: "logo", example: "http://image.." })
	logo: string

	@ApiProperty({ name: "domain" })
	domain: string;


	@ApiProperty({ name: "status" })
	status: GeneralStatus;

	@ApiProperty({ name: "user_count" })
	userCount: number

	@ApiProperty({ name: "application_count" })
	applicationCount: number

	@ApiProperty({ name: "domain_verified" })
	domainVerified: boolean
}


export class OrganizationDetailsResponseDto extends AbstractDTO {

	@ApiProperty({ name: "name" })
	name: string;

	@ApiProperty({ name: "logo", example: "http://image.." })
	logo: string

	@ApiProperty({ name: "domain" })
	domain: string;


	@ApiProperty({ name: "domainVerified" })
	domainVerified: boolean;

	@ApiProperty({ name: "orgId" })
	orgId: string;

	@ApiProperty({ name: "status" })
	status: GeneralStatus;

	@ApiProperty({ name: "user_count" })
	userCount: number

	@ApiProperty({ name: "application_count" })
	applicationCount: number

	@ApiProperty({ name: "has_owner" })
	hasOwner: boolean
}
