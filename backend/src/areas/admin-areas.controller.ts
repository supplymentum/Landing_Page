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
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@ApiTags('Admin - Areas')
@ApiCookieAuth('admin_token')
@UseGuards(JwtAuthGuard)
@Controller('admin/areas')
export class AdminAreasController {
  constructor(private readonly areasService: AreasService) {}

  @ApiOperation({
    summary: 'Get all areas',
    description: 'Returns both active and inactive areas for CMS administration.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of areas returned successfully.',
    schema: {
      example: [
        {
          area_id: 1,
          name: 'Capital Humano y Excelencia',
          short_name: 'CHE',
          description:
            'Area responsable del desarrollo del talento y la cultura organizacional.',
          image_path: 'areas/capital-humano.webp',
          is_active: true,
          sort_order: 1,
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.areasService.findAdminAll();
  }

  @ApiOperation({
    summary: 'Get area by ID',
  })
  @ApiParam({
    name: 'areaId',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Area returned successfully.',
    schema: {
      example: {
        area_id: 1,
        name: 'Capital Humano y Excelencia',
        short_name: 'CHE',
        description:
          'Area responsable del desarrollo del talento y la cultura organizacional.',
        image_path: 'areas/capital-humano.webp',
        is_active: true,
        sort_order: 1,
      },
    },
  })
  @Get(':areaId')
  findOne(
    @Param('areaId', ParseIntPipe)
    areaId: number,
  ) {
    return this.areasService.findAdminOne(areaId);
  }

  @ApiOperation({
    summary: 'Create an area',
  })
  @ApiBody({
    type: CreateAreaDto,
    examples: {
      example1: {
        value: {
          name: 'Capital Humano y Excelencia',
          short_name: 'CHE',
          description:
            'Area responsable del desarrollo del talento y la cultura organizacional.',
          image_path: 'areas/capital-humano.webp',
          is_active: true,
          sort_order: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Area created successfully.',
    schema: {
      example: {
        area_id: 1,
        name: 'Capital Humano y Excelencia',
        short_name: 'CHE',
        description:
          'Area responsable del desarrollo del talento y la cultura organizacional.',
        image_path: 'areas/capital-humano.webp',
        is_active: true,
        sort_order: 1,
      },
    },
  })
  @Post()
  create(
    @Body()
    createAreaDto: CreateAreaDto,
  ) {
    return this.areasService.create(createAreaDto);
  }

  @ApiOperation({
    summary: 'Update an area',
  })
  @ApiParam({
    name: 'areaId',
    type: Number,
    example: 1,
  })
  @ApiBody({
    type: UpdateAreaDto,
    examples: {
      example1: {
        value: {
          name: 'Capital Humano y Excelencia',
          description:
            'Updated area description for talent development and organizational culture.',
          is_active: true,
          sort_order: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Area updated successfully.',
    schema: {
      example: {
        area_id: 1,
        name: 'Capital Humano y Excelencia',
        short_name: 'CHE',
        description:
          'Updated area description for talent development and organizational culture.',
        image_path: 'areas/capital-humano.webp',
        is_active: true,
        sort_order: 2,
      },
    },
  })
  @Patch(':areaId')
  update(
    @Param('areaId', ParseIntPipe)
    areaId: number,
    @Body()
    updateAreaDto: UpdateAreaDto,
  ) {
    return this.areasService.update(areaId, updateAreaDto);
  }

  @ApiOperation({
    summary: 'Deactivate an area',
    description: 'Performs a logical deletion by deactivating the area (is_active = false).',
  })
  @ApiParam({
    name: 'areaId',
    type: Number,
    example: 1,
  })
  @Delete(':areaId')
  remove(
    @Param('areaId', ParseIntPipe)
    areaId: number,
  ) {
    return this.areasService.remove(areaId);
  }
}
