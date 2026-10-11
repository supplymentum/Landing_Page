import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExecutivesService } from './executives.service';

@ApiTags('Directivos')
@Controller('executives')
export class ExecutivesController {
  constructor(private readonly executivesService: ExecutivesService) {}

  @ApiOperation({
    summary: 'Get visible organization executives',
    description:
      'Returns active executives ordered by role hierarchy and display order.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of visible executives returned successfully.',
    schema: {
      example: [
        {
          executive_id: 1,
          full_name: 'Johan Osores',
          role_id: 3,
          role: {
            role_id: 3,
            name: 'Director',
          },
          area_id: 1,
          area: {
            area_id: 1,
            name: 'Capital Humano y Excelencia',
          },
          description: 'Marketing and CRM Director at SupplyMentum.',
          image_path: 'executives/johan-osores.webp',
          linkedin_url: 'https://www.linkedin.com/in/usuario',
          is_active: true,
          sort_order: 1,
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.executivesService.findPublicAll();
  }

  @ApiOperation({
    summary: 'Get a visible executive by ID',
  })
  @ApiParam({
    name: 'executiveId',
    description: 'Executive ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Executive returned successfully.',
    schema: {
      example: {
        executive_id: 1,
        full_name: 'Johan Osores',
        role_id: 3,
        role: {
          role_id: 3,
          name: 'Director',
        },
        area_id: 1,
        area: {
          area_id: 1,
          name: 'Capital Humano y Excelencia',
        },
        description: 'Marketing and CRM Director at SupplyMentum.',
        image_path: 'executives/johan-osores.webp',
        linkedin_url: 'https://www.linkedin.com/in/usuario',
        is_active: true,
        sort_order: 1,
      },
    },
  })
  @Get(':executiveId')
  findOne(
    @Param('executiveId', ParseIntPipe)
    executiveId: number,
  ) {
    return this.executivesService.findPublicOne(executiveId);
  }
}
