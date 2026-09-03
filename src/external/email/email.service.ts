import { Injectable, Logger } from "@nestjs/common";
import { NotImplementedException } from "@nestjs/common/exceptions/not-implemented.exception";
import { ConfigService } from "@nestjs/config";
import * as SendGrid from "@sendgrid/mail";
import { MailData, EmailResponse, EmailType } from "./_types";
import { Secrets } from "../../../src/config/secrets.config";
import { ConfigMapper } from "../../config";

@Injectable()
export class SendgridService {
	private config: Secrets;
	constructor(
		private readonly configService: ConfigService) {
		SendGrid.setApiKey(this.configService.get<Secrets>(ConfigMapper.appConfig).sengridHash);
		this.config = this.configService.get<Secrets>(ConfigMapper.appConfig);

	}

	private async sendMail(mail: SendGrid.MailDataRequired): Promise<any> {
		Logger.log(`Email successfully dispatched to ${mail.to}`, "Email Service");
		return SendGrid.send(mail);
	}

	public async sendMailToSingleUser(mailData: MailData, type: EmailType, data: any): Promise<any> {
		switch (type) {
			case EmailType.EMAIL_VERIFICATION:
				return this.sendMail({
					to: mailData.to,
					cc: mailData.cc,
					bcc: mailData.bcc,
					from: { email: this.config.emailFrom, name: this.config.emailTitle },
					subject: "Please Verify Your Email",
					html: `<p>Please use following code to verify your email address</p></br><h1>${data}</h1>`,
				});
			case EmailType.PASSWORD_RECOVERY:
				return this.sendMail({
					to: mailData.to,
					cc: mailData.cc,
					bcc: mailData.bcc,
					from: { email: this.config.emailFrom, name: this.config.emailTitle },
					subject: "Reset Password",
					html: this.otpContent(data),
				});

			case EmailType.EMAIL_MEMBER_INVITE:
				let emailContent = this.inviteMemberContent(data.token);
				const frontendUrl = this.config.frontendUrl
				console.log(`${frontendUrl}/${data.token}`)
				return this.sendMail({
					to: mailData.to,
					cc: mailData.cc,
					bcc: mailData.bcc,
					from: { email: this.config.emailFrom, name: this.config.emailTitle },
					subject: emailContent?.subject,
					html: emailContent?.html,
				});

			case EmailType.EMAIL_USER_VERIFICARION:
				let verifyUserContent = this.verifyUserContent(data.otp);

				return this.sendMail({
					to: mailData.to,
					cc: mailData.cc,
					bcc: mailData.bcc,
					from: { email: this.config.emailFrom, name: this.config.emailTitle },
					subject: verifyUserContent?.subject,
					html: verifyUserContent?.html,
				});
			default:
				throw new NotImplementedException(`Template for ${type} type of emial is not configured in code base. Please implement those first`);
		}
	}

	private inviteMemberContent(token: string): { subject: string; html: string } {
		const frontendUrl = this.config.frontendUrl;
		return {
			subject: "Invitation to Register",
			html: `
			<div
             style="height: 100vh; width: 100%; padding: 10px; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; margin-top: 30px;">
             <div
             style="background-color: #ffffff; padding: 20px; border-radius: 8px; overflow-x: hidden;">
             <h2 style="font-size: 28px; font-weight: 600; color: #333333; text-align: center;">Invitation to Register for Techbar SSO 👋</h2>
             <p style="font-size: 16px; color: #555555; line-height: 1.5; margin-bottom: 20px;">
			 You've been invited to join us! To complete your registration, please use the following link:</p>
             <div style="text-align: center; margin-top: 40px;">
             <a href="${frontendUrl}/${token}"
             style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; width: 100%;
			 border-radius: 10px; cursor: pointer; font-weight: 600; letter-spacing: 1px; margin-bottom: 20px;">Register Now</a> </div>
             <p style="font-size: 14px; color: #888888; text-align: center;">If you didn't request this invitation, please
             ignore this email.</p>
            </div>
             </div>
			`,
		};
	}

	private verifyUserContent(otp: string): { subject: string; html: string } {
		return {
			subject: "Your OTP for Account Verification",
			html: `
				<p>Thank you for request! Please verify your account using the OTP provided below:</p>
				<h2 style="color: #4CAF50; font-size: 24px;">${otp}</h2>
				<p>This OTP is valid for a limited time. Please enter it on the verification page to complete your registration.</p>
				<p>If you did not request this verification, please ignore this email.</p>
				<br/>
				<p>Best regards,<br/>The Team</p>
			`,
		};
	}

	private otpContent(data: any): string {
		return `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;
		 display: flex; align-items: center; justify-content: center; height: 60vh;  width: 100%;max-width: 600px;margin: auto;padding: 20px; 
		 background-color: #ffffff;border-radius: 8px;box-shadow: 0 2px 4px rgba(0,0,0,0.1);display: flex;flex-direction: column;
		 align-items: center;justify-content: center;">
		<div style="padding: 20px;text-align: center;">
		 <p>Hi, ${data?.name} 👋</p>
		<p>Thank you for your request! Please verify your account using the OTP provided below:</p>
		<div style=" color: #4CAF50;font-size: 36px;font-weight: bold;margin: 20px 0;">${data?.otp}</div>
		<p>This OTP is valid for a limited time. Please enter it on the verification page to complete your password reset.</p>
        <p>If you did not request this verification, please ignore this email.</p>
		<div style=" font-size: 12px; color: #888888; text-align: center; margin-top: 20px;">
		<p style="color: #4CAF50">Best regards,<br/>The SSO Team</p>
		</div>
		</div>`
	}


}
