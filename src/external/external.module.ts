import { Module } from "@nestjs/common";
import { EmailModule } from "./email/email.module";

@Module({
	imports: [EmailModule],
	exports: [EmailModule],
})
export class ExternalAppsModule { }
