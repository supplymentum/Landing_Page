import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
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
import { FaqService } from './faq.service';
import { FaqDto } from './dto/faq.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@ApiTags('Admin - FAQ')
@ApiCookieAuth('admin_token')
@UseGuards(JwtAuthGuard)
@Controller('admin/faq')
export class AdminFaqController {
  constructor(private readonly faqService: FaqService) {}

  @ApiOperation({ summary: 'Create a new FAQ entry' })
  @ApiBody({ type: FaqDto })
  @Post()
  create(@Body() dto: FaqDto) {
    return this.faqService.postFaq(dto);
  }

  @ApiOperation({ summary: 'Update a FAQ entry' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: FaqDto })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: FaqDto) {
    return this.faqService.updateFaq(id, dto);
  }

  @ApiOperation({ summary: 'Delete a FAQ entry' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.faqService.deleteFaq(id);
    return { message: 'Success' };
  }

  @ApiOperation({ summary: 'Reorder FAQ entries' })
  @ApiBody({ type: [UpdateOrderDto] })
  @Patch()
  reorder(@Body() dto: UpdateOrderDto[]) {
    return this.faqService.reorder(dto);
  }
}
