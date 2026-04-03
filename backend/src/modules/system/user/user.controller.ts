import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './user.dto';

/**
 * 用户管理控制器
 */
@ApiTags('系统管理 - 用户管理')
@Controller('system/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   */
  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '创建成功', type: User })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '用户名已存在' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * 查询所有用户
   */
  @Get()
  @ApiOperation({ summary: '查询所有用户' })
  @ApiResponse({ status: 200, description: '查询成功', type: [User] })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * 查询单个用户
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个用户' })
  @ApiResponse({ status: 200, description: '查询成功', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  /**
   * 更新用户
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * 删除用户
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

  /**
   * 修改当前用户密码
   */
  @Post('change-password')
  @ApiOperation({ summary: '修改当前用户密码' })
  @ApiResponse({ status: 200, description: '修改成功' })
  @ApiResponse({ status: 400, description: '原密码错误' })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const userId = req.user?.sub;
    if (!userId) {
      throw new Error('未登录');
    }
    return this.userService.changePassword(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
