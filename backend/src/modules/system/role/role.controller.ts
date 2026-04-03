import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './role.dto';

/**
 * 角色管理控制器
 */
@ApiTags('系统管理 - 角色管理')
@Controller('system/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 创建角色
   */
  @Post()
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 201, description: '创建成功', type: Role })
  @ApiResponse({ status: 409, description: '角色编码已存在' })
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  /**
   * 查询所有角色
   */
  @Get()
  @ApiOperation({ summary: '查询所有角色' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Role] })
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  /**
   * 查询单个角色
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个角色' })
  @ApiResponse({ status: 200, description: '查询成功', type: Role })
  @ApiResponse({ status: 404, description: '角色不存在' })
  findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne(id);
  }

  /**
   * 更新角色
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新角色信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Role })
  @ApiResponse({ status: 404, description: '角色不存在' })
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateRoleDto);
  }

  /**
   * 删除角色
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(id);
  }

  /**
   * 分配权限
   */
  @Post(':id/permissions')
  @ApiOperation({ summary: '分配权限给角色' })
  @ApiResponse({ status: 200, description: '分配成功', type: Role })
  @ApiResponse({ status: 404, description: '角色不存在' })
  assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Role> {
    return this.roleService.assignPermissions(id, assignPermissionsDto.permissionIds);
  }
}
