import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ApplicationDto } from './dto/application.dto';
import type { SupabaseUser } from '../auth/supabase-auth.guard';

@Injectable()
export class ApplicationService {
  constructor(private supabaseService: SupabaseService) {}

  async listAreas() {
    const supabase = this.supabaseService.getClient();

    const { data: areas, error } = await supabase
      .from('areas')
      .select('area_id, name')
      .order('area_id');

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener las áreas: ${error.message}`,
      );
    }

    return areas;
  }

  /**
   * Devuelve la postulación del usuario autenticado, si ya envió una.
   *
   * El frontend la usa para mostrar el estado en vez del formulario.
   */
  async findMyApplication(user: SupabaseUser) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('applicants')
      .select('applicant_id, first_name, last_name, email, status, created_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo verificar tu postulación: ${error.message}`,
      );
    }

    return {
      has_applied: Boolean(data),
      application: data,
    };
  }

  async sendApplication(dto: ApplicationDto, user: SupabaseUser) {
    const supabase = this.supabaseService.getClient();

    if (dto.first_choice_area_id === dto.second_choice_area_id)
      throw new BadRequestException(
        'First choice and second choice areas must be different.',
      );

    // Una postulación por cuenta de Google.
    const { data: existing } = await supabase
      .from('applicants')
      .select('applicant_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      throw new ConflictException(
        'Ya enviaste una postulación con esta cuenta.',
      );
    }

    const { error: error1 } = await supabase
      .from('areas')
      .select('area_id')
      .eq('area_id', dto.first_choice_area_id)
      .single();

    if (error1 && error1.code === 'PGRST116') {
      throw new NotFoundException('First choice area id does not exist.');
    }

    if (dto.second_choice_area_id !== undefined) {
      const { error: error2 } = await supabase
        .from('areas')
        .select('area_id')
        .eq('area_id', dto.second_choice_area_id)
        .single();

      if (error2 && error2.code === 'PGRST116') {
        throw new NotFoundException('Second choice area id does not exist.');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await supabase
      .from('applicants')
      .insert({
        ...dto,
        // La identidad la define la sesión de Google, no el formulario.
        email: user.email,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      // Índice único sobre user_id: carrera entre dos envíos simultáneos.
      if (error.code === '23505') {
        throw new ConflictException(
          'Ya enviaste una postulación con esta cuenta.',
        );
      }

      throw new InternalServerErrorException('Error, please try again.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  }
}
