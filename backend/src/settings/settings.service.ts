import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateConvocatoriaSettingsDto } from './dto/update-convocatoria-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getConvocatoriaSettings() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'convocatoria')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return {
          is_active: true,
          deadline: '2026-08-15T23:59:59.000Z',
          title: 'Únete a SupplyMentum UNI',
          description: 'La convocatoria está abierta. El tiempo corre.'
        };
      }
      throw new InternalServerErrorException(error.message);
    }

    return data.value;
  }

  async updateConvocatoriaSettings(dto: UpdateConvocatoriaSettingsDto) {
    const supabase = this.supabaseService.getClient();

    // Fetch current settings to merge
    const currentSettings = await this.getConvocatoriaSettings();
    const newSettings = { ...currentSettings, ...dto };

    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'convocatoria', value: newSettings, updated_at: new Date().toISOString() });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return newSettings;
  }
}
