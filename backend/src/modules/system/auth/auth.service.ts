import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
import * as bcrypt from 'bcrypt';

/**
 * 认证服务
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证用户登录
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (!user.enabled) {
      throw new UnauthorizedException('账号已被禁用');
    }

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 用户登录
   */
  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles?.map((r) => r.code) || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        realName: user.realName,
      },
    };
  }

  /**
   * 用户注册
   */
  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles?.map((r) => r.code) || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        realName: user.realName,
      },
    };
  }
}
