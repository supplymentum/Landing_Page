import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @ApiOperation({ summary: 'List FAQ entries ordered for public display' })
  @Get()
  getFaq() {
    return this.faqService.getFaq();
  }
}
