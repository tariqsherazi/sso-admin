import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { SKIP_AUTH } from "../config";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	constructor(private reflector: Reflector) {
		super();
	}

	/**
	 * Verify the token is valid
	 * @param context {ExecutionContext}
	 * @returns super.canActivate(context)
	 */
	canActivate(context: ExecutionContext) {
		const skipAuth = this.reflector.getAllAndOverride<boolean>(
			SKIP_AUTH,
			[context.getHandler(), context.getClass()],
		);
		if (skipAuth) {
			return true;
		}

		const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(context.switchToHttp().getRequest());
		if (!accessToken) {
			throw new UnauthorizedException("Token not found which causes unauthorized request. Please authenticate yourself before making request");
		}

		return super.canActivate(context);
	}

	/**
	 * Custom error handling for JWT-related issues
	 * @param err The error thrown by the JWT validation process
	 * @param user The user object returned if authentication succeeds
	 * @param info Additional info, such as token expiration or invalid token
	 * @returns User object or throws a custom UnauthorizedException
	 */
	handleRequest(err, user, info) {
		if (err || !user) {
			if (info?.name === 'TokenExpiredError') {
				throw new UnauthorizedException("Your session has expired. Please log in again.");
			} else if (info?.name === 'JsonWebTokenError') {
				throw new UnauthorizedException("Invalid token. Please provide a valid token.");
			} else {
				throw new UnauthorizedException(err?.message || "Authentication failed.");
			}
		}
		return user;
	}
}
