import { registerAs } from "@nestjs/config";
import { ConfigMapper } from "./index";

export interface Secrets {
  nodeEnv: string;
  port: number;
  APIPrefix: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  invitationJwtExpiresIn: string;
  refreshExpiresIn: string;
  otpExpiresIn: string;
  host: string;
  protocol: string;
  emailFrom: string;
  frontendUrl: string;
  sengridHash: string;
  emailTitle: string;
}

export const registerConfgurationSecrets = registerAs(
  ConfigMapper.appConfig,
  (): Secrets => ({
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT, 10) || 3000,
    APIPrefix: "api",
    jwtSecret: process.env.JWT_SECRET || "thereIsNoSecretForCreatingJWT",
    jwtExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "2d",
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    invitationJwtExpiresIn: process.env.INVITATION_TOKEN_EXPIRES_IN || "1h",
    otpExpiresIn: process.env.OTP_EXPIRES_IN || "20", // otp expiry time in minutes
    host: process.env.HOST || "localhost",
    protocol: process.env.PROTOCOL || "http",
    emailFrom: process.env.EMAIL_FROM || "",
    frontendUrl:
      process.env.FRONTEND_URL || "https://sso-admin.4iisolutions.com/confirm",
    sengridHash: process.env.SENDGRID_HASH || "",
    emailTitle: process.env.EMAIL_TITLE || "Techbar SSO",
  }),
);
