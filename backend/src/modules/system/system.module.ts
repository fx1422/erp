import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/user.entity';
import { Role } from './role/role.entity';
import { Permission } from './permission/permission.entity';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'erp-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController, RoleController, AuthController],
  providers: [UserService, RoleService, AuthService],
  exports: [UserService, RoleService, TypeOrmModule],
})
export class SystemModule {}
