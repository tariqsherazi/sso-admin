export const ResponseMessageKey = "ResponseMessageKey";

export enum GeneralResponseMessage {
	SUCCESS = "Request completed successfully",
	WARN = "The request in not valid. Please try again with different params",
	ERROR = "The request failed with an error",
	INVALID_REQUEST = "Invalid request. The required validation failed for request, please revisit the parameters",
}

export enum PostgresErrorCode {
	UniqueViolation = "23505",
	ForeignKeyVoilation = "23503"
}
