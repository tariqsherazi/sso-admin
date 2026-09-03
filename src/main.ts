/* eslint-disable global-require */
import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import helmet from "helmet";
import { ConfigMapper, SwaggerConfig } from "./config";
import { Secrets } from "./config/interfaces";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./_interceptors/transform.interceptor";
import { ResponseInterceptor } from "./_interceptors/response.interceptor";
import { TimeoutInterceptor } from "./_interceptors/timeout.interceptor";
// import * as fs from "fs";
// import * as path from "path";

// // Read the config.json file
// const configFilePath = path.resolve(__dirname, '../config.json');
// const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
// const defaultOrigins: string[] = configData.allowedOrigins;

async function bootstrap() {
    const logger = new Logger("Bootstraping", { timestamp: true });
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    app.use(helmet());
    app.enableCors({ origin: "*", credentials: true });
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
        prefix: "v",
    });

    const configService = app.get(ConfigService);
    const appConfig = configService.get<Secrets>(ConfigMapper.appConfig);

    app.setGlobalPrefix(appConfig.APIPrefix);
    app.useGlobalInterceptors(
        new TransformInterceptor(),
        new ResponseInterceptor(new Reflector()),
        new TimeoutInterceptor(),
    );

    app.useGlobalPipes(new ValidationPipe({
        validatorPackage: require("class-validator"),
        transformerPackage: require("class-transformer"),
        // whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));

    SwaggerConfig(app, "1");

    const { protocol, host, port } = appConfig;

    await app.listen(port);
    logger.log(`App is running in "${appConfig.nodeEnv}" mode, and it is listening at: ${protocol}://${host}:${port}/${appConfig.APIPrefix}/v1/docs`);
}
bootstrap();
