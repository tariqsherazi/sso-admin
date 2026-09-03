/* eslint-disable @typescript-eslint/naming-convention */
import {
	ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost } from "@nestjs/core";
import { ErrorResponse } from "../dtos";
import { GeneralResponseMessage, PostgresErrorCode } from "../constants";
import { Secrets } from "../../config/interfaces";
import { ConfigMapper } from "../../config";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly configservice: ConfigService,
	) { }

	catch(exception: any, host: ArgumentsHost): void {
		// In certain situations `httpAdapter` might not be available in the
		// constructor method, thus we should resolve it here.
		const { httpAdapter } = this.httpAdapterHost;
		const isProd: boolean = this.configservice.get<Secrets>(ConfigMapper.appConfig).nodeEnv === "prod";

		const ctx = host.switchToHttp();
		let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
		let errorMessage: string = "Error occured while processing the request";
		const errors: string[] = exception.response?.message ? [exception.response?.message] : [];
		const path: string = httpAdapter.getRequestUrl(ctx.getRequest());
		const stack: unknown = isProd ? "No stack in production" : exception.stack;

		if (exception instanceof HttpException) {
			statusCode = exception.getStatus();
			errorMessage = exception.message;
		}

		if (exception instanceof BadRequestException) {
			statusCode = exception.getStatus();
			errorMessage = GeneralResponseMessage.INVALID_REQUEST;
		}

		if (exception.code === PostgresErrorCode.UniqueViolation) {
			statusCode = HttpStatus.CONFLICT;
			let voilationKey: string = exception.detail?.split("=")[0];
			voilationKey = voilationKey?.substring(voilationKey.indexOf("(") + 1, voilationKey.indexOf(")"));
			errorMessage = "There is a conflict with existing, new record cannot be created. Please resolve conflict to create new record";
			errors.push(`The record already exists with same ${voilationKey}`);
		}

		if (exception.code === PostgresErrorCode.ForeignKeyVoilation) {
			statusCode = HttpStatus.NOT_ACCEPTABLE;
			let voilationId: string = exception.detail?.split("=")[1];
			voilationId = voilationId?.substring(voilationId.indexOf("(") + 1, voilationId.indexOf(")"));
			let voilationEntity: string = exception.detail?.split("table ")[1];
			console.log(voilationEntity);
			voilationEntity = voilationEntity?.substring(voilationEntity.indexOf('"') + 1, voilationEntity.indexOf('".'));
			errorMessage = "Unable to create the record due to a conflict with an existing entry. Please ensure that the referenced records exist and are correct, and resolve any discrepancies before trying again.";
			errors.push(`No ${voilationEntity} found with id ${voilationId}. Please ensure that the referenced ${voilationEntity} exist and id is correct`);
		}

		// eslint-disable-next-line max-len, no-nested-ternary
		const excep = Object.keys(exception).length ? isProd ? JSON.stringify({ error: exception, stack }) : JSON.stringify({ error: exception, stack }, null, 2) : `Error: ${exception} at ${stack}`;

		const logMessage: string = `Error occured in request "${path}" with exception ${excep}`;

		if (statusCode >= 500) { Logger.error(logMessage, "HTTP Error Handler"); } else Logger.warn(logMessage, "HTTP Error Handler");

		if (!errors.length) errors.push("Unknown error occured");

		const responseBody: ErrorResponse = {
			status_code: statusCode,
			message: errorMessage,
			errors,
			path,
			stack,
			timestamp: new Date().toISOString(),
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
	}
}
