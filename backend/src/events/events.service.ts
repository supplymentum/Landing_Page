import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { MediaService } from '../media/media.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

export interface EventRecord {
  event_id: number;
  title: string;
  description: string;
  location: string;
  image_path: string | null;
  registration_link: string | null;
  summary_link: string | null;
  start_date_time: string;
  is_active: boolean;
  starred: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable()
export class EventsService {
  private readonly tableName = 'events';

  private readonly publicColumns = `
    event_id,
    title,
    description,
    location,
    image_path,
    registration_link,
    summary_link,
    start_date_time,
    is_active,
    starred
  `;

  private readonly adminColumns = `
    event_id,
    title,
    description,
    location,
    image_path,
    registration_link,
    summary_link,
    start_date_time,
    is_active,
    starred,
    created_at,
    updated_at
  `;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Agrega la URL pública de la imagen a partir de image_path.
   *
   * image_url no se almacena en la base de datos.
   * Se calcula dinámicamente a partir de Supabase Storage.
   */
  private withImageUrl<T extends { image_path: string | null }>(record: T) {
    return {
      ...record,
      image_url: record.image_path
        ? this.mediaService.getPublicUrl(record.image_path)
        : null,
    };
  }

  /**
   * Orden de eventos:
   *
   * 1. Destacados primero.
   * 2. Eventos con inscripciones abiertas.
   * 3. Activos: fecha ascendente.
   * 4. Inactivos: fecha descendente.
   */
  private sortEvents<T extends EventRecord>(events: T[]): T[] {
    return events.sort((a, b) => {
      if (a.starred !== b.starred) {
        return Number(b.starred) - Number(a.starred);
      }

      if (a.is_active !== b.is_active) {
        return Number(b.is_active) - Number(a.is_active);
      }

      const dateA = new Date(a.start_date_time).getTime();

      const dateB = new Date(b.start_date_time).getTime();

      if (a.is_active && b.is_active) {
        return dateA - dateB;
      }

      return dateB - dateA;
    });
  }

  /**
   * Valida la regla de negocio de inscripciones.
   */
  private validateRegistration(
    isActive: boolean,
    registrationLink?: string | null,
  ): void {
    if (
      isActive &&
      (!registrationLink || registrationLink.trim().length === 0)
    ) {
      throw new BadRequestException(
        'registration_link es obligatorio cuando is_active es true',
      );
    }
  }

  /**
   * Eventos disponibles para la landing.
   */
  async findPublicAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.publicColumns);

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener los eventos: ${error.message}`,
      );
    }

    return this.sortEvents(data ?? []).map((event) => this.withImageUrl(event));
  }

  /**
   * Obtiene un evento para la landing.
   */
  async findPublicOne(eventId: number) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.publicColumns)
      .eq('event_id', eventId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el evento: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`No existe un evento con el ID ${eventId}`);
    }

    return this.withImageUrl(data);
  }

  /**
   * Retorna todos los eventos para el CMS.
   */
  async findAdminAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.adminColumns);

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener los eventos: ${error.message}`,
      );
    }

    return this.sortEvents(data ?? []).map((event) => this.withImageUrl(event));
  }

  /**
   * Retorna un evento para el CMS.
   */
  async findAdminOne(eventId: number): Promise<EventRecord> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.adminColumns)
      .eq('event_id', eventId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el evento: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`No existe un evento con el ID ${eventId}`);
    }

    return this.withImageUrl(data);
  }

  /**
   * Crea un nuevo evento.
   */
  async create(createEventDto: CreateEventDto) {
    const isActive = createEventDto.is_active ?? false;

    this.validateRegistration(isActive, createEventDto.registration_link);

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        title: createEventDto.title,
        description: createEventDto.description,
        location: createEventDto.location,
        image_path: createEventDto.image_path ?? null,
        registration_link: createEventDto.registration_link ?? null,
        summary_link: createEventDto.summary_link ?? null,
        start_date_time: createEventDto.start_date_time,
        is_active: isActive,
        starred: createEventDto.starred ?? false,
      })
      .select(this.adminColumns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un evento con esos datos');
      }

      throw new InternalServerErrorException(
        `No se pudo crear el evento: ${error.message}`,
      );
    }

    return this.withImageUrl(data);
  }

  /**
   * Actualiza parcialmente un evento.
   */
  async update(eventId: number, updateEventDto: UpdateEventDto) {
    const existingEvent = await this.findAdminOne(eventId);

    const effectiveIsActive =
      updateEventDto.is_active ?? existingEvent.is_active;

    const effectiveRegistrationLink =
      updateEventDto.registration_link ?? existingEvent.registration_link;

    this.validateRegistration(effectiveIsActive, effectiveRegistrationLink);

    const updateData: Record<string, unknown> = {};

    if (updateEventDto.title !== undefined) {
      updateData.title = updateEventDto.title;
    }

    if (updateEventDto.description !== undefined) {
      updateData.description = updateEventDto.description;
    }

    if (updateEventDto.location !== undefined) {
      updateData.location = updateEventDto.location;
    }

    if (updateEventDto.image_path !== undefined) {
      updateData.image_path = updateEventDto.image_path;
    }

    if (updateEventDto.registration_link !== undefined) {
      updateData.registration_link = updateEventDto.registration_link;
    }

    if (updateEventDto.summary_link !== undefined) {
      updateData.summary_link = updateEventDto.summary_link;
    }

    if (updateEventDto.start_date_time !== undefined) {
      updateData.start_date_time = updateEventDto.start_date_time;
    }

    if (updateEventDto.is_active !== undefined) {
      updateData.is_active = updateEventDto.is_active;
    }

    if (updateEventDto.starred !== undefined) {
      updateData.starred = updateEventDto.starred;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar',
      );
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('event_id', eventId)
      .select(this.adminColumns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un evento con esos datos');
      }

      throw new InternalServerErrorException(
        `No se pudo actualizar el evento: ${error.message}`,
      );
    }

    return this.withImageUrl(data);
  }

  /**
   * Elimina un evento.
   */
  async remove(eventId: number) {
    await this.findAdminOne(eventId);

    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('event_id', eventId);

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo eliminar el evento: ${error.message}`,
      );
    }

    return {
      message: 'Evento eliminado correctamente',
      event_id: eventId,
    };
  }
}
