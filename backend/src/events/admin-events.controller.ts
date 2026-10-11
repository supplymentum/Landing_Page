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
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('Admin - Events')
@ApiCookieAuth('admin_token')
@UseGuards(JwtAuthGuard)
@Controller('admin/events')
export class AdminEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: 'Get all events',
  })
  @Get()
  findAll() {
    return this.eventsService.findAdminAll();
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
    return this.eventsService.findAdminOne(eventId);
  }

  @ApiOperation({
    summary: 'Create an event',
  })
  @Post()
  create(
    @Body()
    createEventDto: CreateEventDto,
  ) {
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({
    summary: 'Update an event',
  })
  @ApiParam({
    name: 'eventId',
    type: Number,
    example: 1,
  })
  @Patch(':eventId')
  update(
    @Param('eventId', ParseIntPipe)
    eventId: number,
    @Body()
    updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(eventId, updateEventDto);
  }

  @ApiOperation({
    summary: 'Delete an event',
  })
  @ApiParam({
    name: 'eventId',
    type: Number,
    example: 1,
  })
  @Delete(':eventId')
  remove(
    @Param('eventId', ParseIntPipe)
    eventId: number,
  ) {
    return this.eventsService.remove(eventId);
  }
}
