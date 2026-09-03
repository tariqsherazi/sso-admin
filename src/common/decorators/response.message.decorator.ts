import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { ResponseMessageKey } from "../constants";

export const ResponseMessage = (message: string): CustomDecorator<string> => SetMetadata(ResponseMessageKey, message);
