import { SetMetadata } from "@nestjs/common";
import { SKIP_AUTH } from "../../config";

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
