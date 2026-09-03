import { ApiProperty } from "@nestjs/swagger";
import { GeneralResponseMessage } from "../../common";

/**
 * Dtos for the responses
 */
export class ApiResponse<T> {
	@ApiProperty({ example: 200 })
	// eslint-disable-next-line @typescript-eslint/naming-convention
	status_code: number;

	@ApiProperty({ example: GeneralResponseMessage.SUCCESS })
	message: string;

	@ApiProperty()
	data: T;

	@ApiProperty({ example: new Date().toISOString() })
	timestamp: string;
}

export class ErrorResponse {
	@ApiProperty({ example: 500 })
	// eslint-disable-next-line @typescript-eslint/naming-convention
	status_code: number;

	@ApiProperty()
	message: string;

	@ApiProperty({ example: "/api/v1/auth/signin" })
	path: string;

	@ApiProperty({ oneOf: [{ type: "string", example: "Some error occured" }, { type: "array", items: { type: "string", example: "List of errors occured" } }] })
	errors?: unknown;

	@ApiProperty({ example: new Date().toISOString() })
	timestamp: string;

	@ApiProperty({ type: "string" })
	stack?: unknown;
}
