import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Secrets } from "../../config/interfaces";
import { ConfigMapper } from "../../config";
import { ValidateTokenResponseDto, JwtPayload, TokenDto, InviteMemberPayload } from "./_types";

@Injectable()
export class TokenService {
  private config: Secrets;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.config = this.configService.get<Secrets>(ConfigMapper.appConfig);
  }

  /**
   * Generate Auth token(JWT) service for login user
   * @param JwtPayload {JwtPayload}
   * @returns TokenDto Returns access and refresh tokens with expiry
   */
  public generateAuthToken(payload: JwtPayload): TokenDto {
    const accessTokenExpires = this.config.jwtExpiresIn;
    const refreshTokenExpires = this.config.refreshExpiresIn;

    const accessToken = this.generateToken(payload, accessTokenExpires);
    const refreshToken = this.generateToken(payload, refreshTokenExpires);

    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
    };
  }

  /**
   * Generate Refresh token(JWT) service for generating new refresh and access tokens
   * @param payload {JwtPayload}
   * @returns  Returns access and refresh tokens with expiry or error
   */
  public generateRefreshToken(refreshToken: string): TokenDto {
    const { id, username, email, userData } = this.verifyToken(refreshToken);
    return this.generateAuthToken({ id, username, email, userData });
  }

  /**
   * Verify JWT service
   * @param token JWT token
   * @param type {TokenType} "refresh" or "access"
   * @returns decrypted payload from JWT
   */
  public verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  /**
   * Validate received JWT
   * @param token {string}
   * @returns valid: boolean
   */
  public async validateToken(token: string): Promise<ValidateTokenResponseDto> {
    try {
      const { id } = this.jwtService.verify(token);
      return { valid: !!id };
    } catch (error) {
      Logger.error("Validation token error", error);
      return { valid: false };
    }
  }

  /**
   * Generate JWT token
   * @private
   * @param payload {JwtPayload}
   * @param expiresIn {string}
   * @returns JWT
   */
  private generateToken(payload: JwtPayload, expiresIn: string): string {
    const token = this.jwtService.sign(payload, { expiresIn });
    return token;
  }

  public generateInvitationToken(payload: InviteMemberPayload): string {
    const invitationJwtExpiresIn = this.config.invitationJwtExpiresIn;

    const token = this.jwtService.sign(payload, { expiresIn: invitationJwtExpiresIn });
    return token;

  }

  public async verifyInvitationToken(token: string) {
    try {
      let payload = await this.jwtService.verify(token);
      return { ...payload };
    } catch (error) {
      Logger.error("Validation token error", error);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invitation expired, please request a new invitation.');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid Link, please request a new invitation.');
      } else {
        throw new UnauthorizedException('Unable to verify token.');
      }
    }
  }
}
