import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FaqDto } from './dto/faq.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class FaqService {
  private readonly logger = new Logger(FaqService.name);
  constructor(private supabaseService: SupabaseService) {}

  async getFaq() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('faq')
      .select('faq_id, pregunta, respuesta, orden')
      .order('orden', { ascending: true });

    if (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error interno, intentar más tarde.',
      );
    }
    return data;
  }

  async postFaq(dto: FaqDto) {
    const supabase = this.supabaseService.getClient();

    const { data: ordenMax, error: ordenError } = await supabase
      .from('faq')
      .select('orden.max()')
      .single();

    if (ordenError) {
      this.logger.error(ordenError);
      throw new InternalServerErrorException(
        'Error obteniendo órdenes de la FAQ. Intente agregando manualmente un orden.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await supabase
      .from('faq')
      .insert([
        {
          pregunta: dto.pregunta,
          respuesta: dto.respuesta,
          orden: ordenMax.max + 1,
        },
      ])
      .select()
      .single();

    if (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error, intentarlo de nuevo más tarde.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  }

  async updateFaq(id: number, dto: FaqDto) {
    const supabase = this.supabaseService.getClient();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await supabase
      .from('faq')
      .update(dto)
      .eq('faq_id', id)
      .select()
      .single();

    if (error) {
      if (error.code == 'PGRST116')
        throw new NotFoundException('FAQ ID no encontrado.');
      this.logger.error(error);
      throw new InternalServerErrorException('Error, intentarlo más tarde.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  }

  async deleteFaq(id: number) {
    const supabase = this.supabaseService.getClient();

    const { error: error } = await supabase.from('faq').delete().eq('faq_id', id);

    if (error) {
      if (error.code == 'PGRST116')
        throw new NotFoundException('FAQ ID no encontrado.');
      this.logger.error(error);
      throw new InternalServerErrorException('Error, intentarlo más tarde.');
    }
  }

  async reorder(dto: UpdateOrderDto[]) {
    const supabase = this.supabaseService.getClient();

    //Observación: Se recomienda enviar en el arreglo todas las id
    //const { data: idList, error } = await supabase.from('faq').select('id');
    //if (error) throw new InternalServerErrorException('Error, intentarlo más tarde.');

    //Observación: Importante resaltar que si se envían ids inválidos, simplemente no se agregarán las filas inválidas dado que no tienen la pregunta y la respuesta requerida.
    const { data, error } = await supabase.from('faq').upsert(dto).select();
    if (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error, intentarlo más tarde.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  }
}
