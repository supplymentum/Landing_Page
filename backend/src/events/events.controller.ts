import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: 'Get public events',
    description:
      'Returns events ordered by featured status, registration status and date.',
  })
  @Get()
  findAll() {
    return this.eventsService.findPublicAll();
  }

  @ApiOperation({
    summary: 'Get an event by ID',
  })
  @ApiParam({
    name: 'eventId',
    type: Number,
    example: 1,
  })
  @Get(':eventId')
  findOne(
    @Param('eventId', ParseIntPipe)
    eventId: number,
  ) {
    return this.eventsService.findPublicOne(eventId);
  }
}
