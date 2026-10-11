import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AreasService } from './areas.service';

@ApiTags('Areas')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @ApiOperation({
    summary: 'Get active areas',
    description: 'Returns the areas currently visible on the landing page.',
  })
  @Get()
  findAll() {
    return this.areasService.findPublicAll();
  }

  @ApiOperation({
    summary: 'Get an active area by ID',
  })
  @ApiParam({
    name: 'areaId',
    type: Number,
    example: 1,
  })
  @Get(':areaId')
  findOne(
    @Param('areaId', ParseIntPipe)
    areaId: number,
  ) {
    return this.areasService.findPublicOne(areaId);
  }
}
