import * as Joi from "joi";

export const validationSchema = Joi.object({
	nodeEnv: Joi.string().required(),
	port: Joi.number().default(3000),
	APIPrefix: Joi.string().required().default("api"),
	jwtSecret: Joi.string().default("thereIsNoSecretForCreatingJWT"),
	jwtExpiresIn: Joi.string().default("2h"),
});

export default validationSchema;
