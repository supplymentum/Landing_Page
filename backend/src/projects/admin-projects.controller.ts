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
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Admin - Projects')
@ApiCookieAuth('admin_token')
@UseGuards(JwtAuthGuard)
@Controller('admin/projects')
export class AdminProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Get all projects' })
  @Get()
  findAll() {
    return this.projectsService.findAdminAll();
  }

  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'projectId', type: Number, example: 1 })
  @Get(':projectId')
  findOne(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.findAdminOne(projectId);
  }

  @ApiOperation({ summary: 'Create a project' })
  @ApiBody({ type: CreateProjectDto })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'projectId', type: Number, example: 1 })
  @ApiBody({ type: UpdateProjectDto })
  @Patch(':projectId')
  update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(projectId, updateProjectDto);
  }

  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'projectId', type: Number, example: 1 })
  @Delete(':projectId')
  remove(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.remove(projectId);
  }
}
