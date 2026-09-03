export {
	AUTH_OPTIONS, SKIP_AUTH, SwaggerConfig, TOKEN_NAME,
} from "./swagger.config";

export enum ConfigMapper {
	appConfig = "configurationSecrets",
	database = "typeorm",
}
