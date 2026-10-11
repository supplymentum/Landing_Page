import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateApplicantStatusDto } from './dto/update-applicant-status.dto';

@Injectable()
export class AdminService {
  private readonly columns =
    'applicant_id, first_name, last_name, email, phone, career, codigo_uni, university_semester, first_choice_area_id, second_choice_area_id, application_reason, status, created_at';

  constructor(private supabaseService: SupabaseService) {}

  async getApplicants() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('applicants')
      .select(this.columns)
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener las postulaciones: ${error.message}`,
      );
    }

    return data;
  }

  /**
   * Cambia el estado de revisión de una postulación
   * (pendiente, aceptado o rechazado).
   */
  async updateApplicantStatus(
    applicantId: string,
    dto: UpdateApplicantStatusDto,
  ) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('applicants')
      .update({ status: dto.status })
      .eq('applicant_id', applicantId)
      .select(this.columns)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo actualizar la postulación: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(
        `No existe una postulación con el ID ${applicantId}`,
      );
    }

    return data;
  }

  /**
   * Elimina definitivamente una postulación.
   *
   * Al borrarla se libera la cuenta de Google asociada, por lo que esa
   * persona podría volver a postular.
   */
  async removeApplicant(applicantId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('applicants')
      .delete()
      .eq('applicant_id', applicantId)
      .select('applicant_id')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo eliminar la postulación: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(
        `No existe una postulación con el ID ${applicantId}`,
      );
    }

    return {
      message: 'Postulación eliminada correctamente',
      applicant_id: applicantId,
    };
  }
}
