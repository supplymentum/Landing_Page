import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationDto } from './dto/application.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  SupabaseAuthGuard,
  type SupabaseUser,
} from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/supabase-user.decorator';

@ApiTags('Applications')
@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @ApiOperation({ summary: 'List available areas for applicants' })
  @Get('areas')
  getAreas() {
    return this.applicationService.listAreas();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check whether the signed-in user already applied',
  })
  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  getMyApplication(@CurrentUser() user: SupabaseUser) {
    return this.applicationService.findMyApplication(user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Submit an application',
    description: 'Requires a Google session. Each account can apply only once.',
  })
  @ApiBody({ type: ApplicationDto })
  @UseGuards(SupabaseAuthGuard)
  @Post()
  sendApplication(
    @Body() applicationDto: ApplicationDto,
    @CurrentUser() user: SupabaseUser,
  ) {
    return this.applicationService.sendApplication(applicationDto, user);
  }
}
