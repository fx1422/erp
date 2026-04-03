import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

/**
 * JWT 策略
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'erp-secret-key-change-in-production',
    });
  }

  /**
   * 验证 JWT Token
   */
  async validate(payload: any) {
    const user = await this.userService.findByUsername(payload.username);

    if (!user || !user.enabled) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      realName: user.realName,
      roles: payload.roles,
    };
  }
}
