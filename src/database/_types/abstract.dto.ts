import { ApiProperty } from "@nestjs/swagger";


export class UserDataDTO {
	@ApiProperty({ example: 'John' })
	firstName: string;

	@ApiProperty({ example: 'Doe' })
	lastName: string;

	@ApiProperty({ example: '12345' })
	id: number;

	@ApiProperty({ example: 'http://image...' })
	profilePicture: string
}
export abstract class AbstractDTO {
	constructor(data?: Partial<AbstractDTO>) {
		Object.assign(this, data);
	}

	@ApiProperty({ type: "number", example: 1 })
	id?: number;

	@ApiProperty({ name: "created_at", example: new Date().toISOString() })
	createdAt?: string;

	@ApiProperty({ name: "updated_at", example: new Date().toISOString() })
	updatedAt?: string;

	@ApiProperty({ name: "created_by" })
	createdBy: UserDataDTO;

	@ApiProperty({ name: "updated_by" })
	updatedBy: UserDataDTO;

	@ApiProperty({ name: "deleted_by" })
	deletedBy: UserDataDTO;
}
