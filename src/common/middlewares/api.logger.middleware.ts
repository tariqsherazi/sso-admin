import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { keysToCamel } from "../helpers/case.typing.helper";

@Injectable()
export class ApiLogger implements NestMiddleware {
	private logger = new Logger("HTTP");

	use(request: Request, response: Response, next: NextFunction) {
		request.body = keysToCamel(request.body);
		response.on("finish", () => {
			const { method, originalUrl, ip } = request;
			const { statusCode, statusMessage } = response;
			const contentLength = response.get("content-length");
			const userAgent = request.get("user-agent") || "";

			const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} ${contentLength}b :: ${userAgent} ${ip} `;

			if (statusCode >= 500) {
				return this.logger.error(message);
			}

			if (statusCode >= 400) {
				return this.logger.warn(message);
			}

			return this.logger.log(message);
		});

		next();
	}
}
