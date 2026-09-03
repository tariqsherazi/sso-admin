import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const SKIP_AUTH = "skipAuth";
export const TOKEN_NAME = "Access Token";
export const AUTH_OPTIONS: SecuritySchemeObject = {
	type: "http",
	scheme: "bearer",
	bearerFormat: "Bearer",
};

const title = "SSO Server";
const description = "This is a custom SSO server biuld for authentication, authorization and baisc managment of users";

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const SwaggerConfig = (app: INestApplication, apiVersion: string) => {
	const options = new DocumentBuilder()
		.setTitle(title)
		.setDescription(description)
		.setVersion(apiVersion)
		.addBearerAuth(AUTH_OPTIONS, TOKEN_NAME)
		.build();

	const document = SwaggerModule.createDocument(app, options);

	SwaggerModule.setup(`api/v${apiVersion}/docs`, app, document);
};
