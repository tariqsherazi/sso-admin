import { ApiProperty } from "@nestjs/swagger";
import { AbstractDTO } from "../../../database/_types";
import { GeneralStatus } from "../../../database/entities/_enums";
class organization {

	@ApiProperty({ name: "name" })
	name: string;

	@ApiProperty({ name: "id" })
	id: number;

	@ApiProperty({ name: "domain" })
	domain: string;

}
export class ApplicationsResponseDto extends AbstractDTO {

	@ApiProperty({ name: "app_name" })
	appName: string;

	@ApiProperty({ name: "url" })
	url: string;

	@ApiProperty({ name: "org_id" })
	appId: string;


	@ApiProperty({ name: "status" })
	status: GeneralStatus;


	@ApiProperty({ name: "organiztion" })
	organization: organization
}


export class ApplicationDetailsResponseDto extends AbstractDTO {

	@ApiProperty({ name: "app_name" })
	appName: string;

	@ApiProperty({ name: "url" })
	url: string;

	@ApiProperty({ name: "org_id" })
	appId: string;


	@ApiProperty({ name: "status" })
	status: GeneralStatus;

	@ApiProperty({ name: "logo" })
	logo: string

	@ApiProperty({ name: "app_secret" })
	appSecret: string


	@ApiProperty({ name: "redirect_uri" })
	redirectUri: string[]

	@ApiProperty({ name: "organiztion" })
	organization: organization
}
