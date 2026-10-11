import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Admin - Roles')
@ApiCookieAuth('admin_token')
@UseGuards(JwtAuthGuard)
@Controller('admin/roles')
export class AdminRolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({
    summary: 'Get all organization roles',
    description: 'Returns active and inactive roles available in the CMS.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of roles returned successfully.',
    schema: {
      example: [
        {
          role_id: 1,
          name: 'Director',
          sort_order: 3,
          is_active: true,
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({
    summary: 'Get a role by its ID',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role returned successfully.',
    schema: {
      example: {
        role_id: 1,
        name: 'Director',
        sort_order: 3,
        is_active: true,
      },
    },
  })
  @Get(':roleId')
  findOne(
    @Param('roleId', ParseIntPipe)
    roleId: number,
  ) {
    return this.rolesService.findOne(roleId);
  }

  @ApiOperation({
    summary: 'Create a new role for the organization',
  })
  @ApiBody({
    type: CreateRoleDto,
    examples: {
      example1: {
        value: {
          name: 'Director',
          sort_order: 3,
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully.',
    schema: {
      example: {
        role_id: 1,
        name: 'Director',
        sort_order: 3,
        is_active: true,
      },
    },
  })
  @Post()
  create(
    @Body()
    createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({
    summary: 'Update role data',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: Number,
    example: 1,
  })
  @ApiBody({
    type: UpdateRoleDto,
    examples: {
      example1: {
        value: {
          name: 'Senior Director',
          sort_order: 2,
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully.',
    schema: {
      example: {
        role_id: 1,
        name: 'Senior Director',
        sort_order: 2,
        is_active: true,
      },
    },
  })
  @Patch(':roleId')
  update(
    @Param('roleId', ParseIntPipe)
    roleId: number,
    @Body()
    updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(roleId, updateRoleDto);
  }

  @ApiOperation({
    summary: 'Deactivate an organization role',
    description:
      'Performs a logical deletion by setting is_active to false.',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: Number,
    example: 1,
  })
  @Delete(':roleId')
  remove(
    @Param('roleId', ParseIntPipe)
    roleId: number,
  ) {
    return this.rolesService.remove(roleId);
  }
}
