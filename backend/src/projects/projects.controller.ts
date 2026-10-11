import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({
    summary: 'Get public projects',
    description:
      'Returns active projects ordered by featured status, year and sort order.',
  })
  @Get()
  findAll() {
    return this.projectsService.findPublicAll();
  }

  @ApiOperation({ summary: 'Get a public project by slug' })
  @ApiParam({ name: 'slug', example: 'diagnostico-mypes' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findPublicOne(slug);
  }
}
