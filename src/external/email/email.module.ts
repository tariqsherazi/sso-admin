import { Module } from "@nestjs/common";
import { SendgridService } from "./email.service";

@Module({
	providers: [SendgridService],
	exports: [SendgridService],
})
export class EmailModule { }
