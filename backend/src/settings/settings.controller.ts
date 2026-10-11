import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateConvocatoriaSettingsDto } from './dto/update-convocatoria-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Get convocatoria settings (public)' })
  @Get('convocatoria')
  getConvocatoriaSettings() {
    return this.settingsService.getConvocatoriaSettings();
  }

  @ApiCookieAuth('admin_token')
  @ApiOperation({ summary: 'Update convocatoria settings (admin only)' })
  @UseGuards(JwtAuthGuard)
  @Patch('convocatoria')
  updateConvocatoriaSettings(@Body() dto: UpdateConvocatoriaSettingsDto) {
    return this.settingsService.updateConvocatoriaSettings(dto);
  }
}
