import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigMapper } from "../../config";
import { Secrets } from "../../config/interfaces";
import { MemberService } from "../members/member.service";
import { UserAuthStatus } from "src/database/entities/_enums";
import { TokenExpiredError } from "jsonwebtoken";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService,
    private memberService: MemberService
  ) {
    const appConfig = configService.get<Secrets>(ConfigMapper.appConfig);
    super({
      secretOrKey: appConfig.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: any) {
    try {
      let member = await this.memberService.filter({ id: payload.id })
      if (!member || member.status !== UserAuthStatus.Active) {
        throw new UnauthorizedException("Your account is not active. Please contact support for further assistance.");
      }
      return { ...payload };
    } catch (error) {
      throw new UnauthorizedException(error?.message || error);
    }
  }
}

