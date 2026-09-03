import {
	applyDecorators, HttpCode, Type,
} from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { NotImplementedException } from "@nestjs/common/exceptions";
import {
	ApiOkResponse,
	getSchemaPath,
	ApiExtraModels,
	ApiUnauthorizedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiAcceptedResponse,
	ApiNoContentResponse,
	ApiCreatedResponse,
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiQuery,
	ApiNotAcceptableResponse,
} from "@nestjs/swagger";
import { ResponseMessage } from "../../common/decorators/response.message.decorator";
import { PaginateOptionsDto, ApiResponse, ErrorResponse } from "../dtos";
import { isObject, keysToSnake, toSnakeCase } from "../helpers";

export type ResponseErrorTypes = HttpStatus.BAD_REQUEST | HttpStatus.UNAUTHORIZED | HttpStatus.FORBIDDEN |
	HttpStatus.NOT_FOUND | HttpStatus.CONFLICT | HttpStatus.NOT_ACCEPTABLE;

interface BaseDocumentationParams {
	requestDescription: string,
	responseDescription: string,
	errorResponses?: ResponseErrorTypes[],
	successStatusCode?: HttpStatus.ACCEPTED | HttpStatus.CREATED | HttpStatus.OK | HttpStatus.NO_CONTENT,
	pagination?: boolean
}

interface CustomDataDocParams extends BaseDocumentationParams {
	returnDataExample: Array<any> | string | number | boolean | Record<string, any>
}

interface DtoDocParams extends BaseDocumentationParams {
	returnDataDto: Type<any>,
	isDataArray?: boolean
}

export type DocumentationParams = CustomDataDocParams | DtoDocParams;

const generateDataSchema = (sampleData) => {
	let dataSchema;
	if (Array.isArray(sampleData)) {
		dataSchema = { type: "array", items: generateDataSchema(sampleData[0]) };
	} else {
		switch (typeof sampleData) {
			case "string":
				dataSchema = { type: "string", example: sampleData };
				break;
			case "number":
				dataSchema = { type: "number", example: sampleData };
				break;
			case "boolean":
				dataSchema = { type: "boolean", example: sampleData };
				break;
			default:
				if (isObject(sampleData)) {
					const properties = {};
					Object.keys(sampleData).forEach((key) => {
						if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
							const element = sampleData[key];
							const propertyKey = toSnakeCase(key);
							properties[propertyKey] = generateDataSchema(element);
						}
					});
					dataSchema = { properties };
				} else dataSchema = { type: "object", example: keysToSnake(sampleData) };
				break;
		}
	}
	return dataSchema;
};

const fetchDecoratorForSuccessResponse = (statusCode: number, description: string, schema: any): MethodDecorator => {
	switch (statusCode) {
		case HttpStatus.OK: return ApiOkResponse({ description, schema });

		case HttpStatus.ACCEPTED: return ApiAcceptedResponse({ description, schema });

		case HttpStatus.CREATED: return ApiCreatedResponse({ description, schema });

		case HttpStatus.NO_CONTENT: return ApiNoContentResponse({ description, schema });

		default: throw new NotImplementedException({ message: `Failed to load swagger docs. The success response decorator for ${statusCode} is not found. Please implement it before passing it in ApiDocument decorator` });
	}
};

const getResponseErrorsDecorators = (statusCodes: HttpStatus[]): MethodDecorator[] => {
	const errorDecorators: MethodDecorator[] = [
		ApiInternalServerErrorResponse({
			description: "Internal server error occured while processing the request, please try again in some time and if facing this error repeatedly and you are sure you passed correct and validated params/body, please contact admin.",
			schema: { allOf: [{ $ref: getSchemaPath(ErrorResponse) }] },
		})];

	statusCodes?.forEach((code) => {
		switch (code) {
			case HttpStatus.BAD_REQUEST:
				errorDecorators.push(ApiBadRequestResponse({ description: "Invalid Request, please revisit the params or request body because one of them is not validated from server.\n The return schema for bad request error will be same as of 500, but with different message and errors" }));
				break;
			case HttpStatus.UNAUTHORIZED:
				errorDecorators.push(ApiUnauthorizedResponse({ description: "The access token provided in request cannot be authenticated. The return schema for unaothorize access error will be same as of 500, but with different message and errors" }));
				break;
			case HttpStatus.FORBIDDEN:
				errorDecorators.push(ApiForbiddenResponse({ description: "The action you want to do is not intended to work for your access, if you forget to log in with different credentials, please use /signin. The return schema for access forbidden error will be the same as of 500, but with different message and errors." }));
				break;
			case HttpStatus.NOT_FOUND:
				errorDecorators.push(ApiNotFoundResponse({ description: "The resource you are looking for cannot be found in system, try to revalidate you paths for API and ids for specific resources. The return schema for not-found error will be same as of 500, but with different message and errors" }));
				break;
			case HttpStatus.CONFLICT:
				errorDecorators.push(ApiConflictResponse({ description: "The record you are trying to create in system has some duplicated values which should be unique like username, email, etc.... The return schema for conflict error will be same as of 500, but with different message and errors" }));
				break;
			case HttpStatus.NOT_ACCEPTABLE:
				errorDecorators.push(ApiNotAcceptableResponse({ description: "The request cannot be processed because it references non-existent or invalid data. Please verify that all referenced records are correct and exist in the system. The response format will be similar to a 500 error, but with details specific to the reference issue" }));
				break;

			default: throw new NotImplementedException({ message: `Failed to load swagger docs. The error response decorator for ${code} is not found. Please implement it before passing it in ApiDocument decorator` });
		}
	});

	return errorDecorators;
};

/**
 * Initialize the route and document the API as per params requirement
 * @param params DocumentationParams
 * @returns Group of Decorators which are necessary and repitive in each function
 */
export const ApiDocument = (params: DocumentationParams) => {
	const decorators: MethodDecorator[] = [];

	const {
		requestDescription, responseDescription,
		successStatusCode = 200,
		errorResponses = [HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN],
		pagination = false,
	} = params;

	decorators.push(ResponseMessage(responseDescription));

	let paginatedResponse;
	if (pagination) {
		decorators.push(
			ApiQuery({ name: "orderBy", type: "String", required: false }),
			ApiQuery({ name: "orderDirection", enum: ["ASC", "DESC"], required: false }),
			ApiQuery({
				name: "page", type: "number", required: false, example: 1,
			}),
			ApiQuery({
				name: "limit", type: "number", required: false, example: 20,
			}),
			ApiExtraModels(PaginateOptionsDto),
		);
		paginatedResponse = { [toSnakeCase("paginateOptions")]: { allOf: [{ $ref: getSchemaPath(PaginateOptionsDto) }] } };
	}

	decorators.push(HttpCode(successStatusCode));
	decorators.push(ApiOperation({ description: requestDescription }));
	decorators.push(ApiExtraModels(ApiResponse, ErrorResponse));

	let typeSchemaForData;
	if ("returnDataDto" in params) {
		decorators.push(ApiExtraModels(params.returnDataDto));
		if (pagination || params.isDataArray) {
			typeSchemaForData = { allOf: [{ type: "array", items: { $ref: getSchemaPath(params.returnDataDto) } }] };
		} else typeSchemaForData = { allOf: [{ $ref: getSchemaPath(params.returnDataDto) }] };
	} else {
		typeSchemaForData = generateDataSchema(params.returnDataExample);
	}

	const responseSchema = {
		allOf: [{ $ref: getSchemaPath(ApiResponse) },
		{ properties: { data: typeSchemaForData, ...paginatedResponse } }],
	};

	decorators.push(
		fetchDecoratorForSuccessResponse(successStatusCode, responseDescription, responseSchema),
	);

	// Documenting the errors for swagger
	// const { errorResponses } = params;

	decorators.push(...getResponseErrorsDecorators(errorResponses));

	return applyDecorators(...decorators);
};
