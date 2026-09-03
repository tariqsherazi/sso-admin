export class EmailResponse<TPayload = object> {
	statusCode: number;

	body: TPayload;

	headers: any;
}
