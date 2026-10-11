import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { SupabaseService } from '../supabase/supabase.service';
import { MediaService } from '../media/media.service';

import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  private readonly tableName = 'areas';

  private readonly publicColumns = `
    area_id,
    name,
    short_name,
    description,
    image_path,
    icon_key,
    sort_order,
    requirements,
    activities
  `;

  private readonly adminColumns = `
    area_id,
    name,
    short_name,
    description,
    image_path,
    icon_key,
    is_active,
    sort_order,
    created_at,
    updated_at,
    requirements,
    activities
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
   * Retorna únicamente las áreas visibles para la landing.
   */
  async findPublicAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.publicColumns)
      .eq('is_active', true)
      .order('sort_order', {
        ascending: true,
      })
      .order('area_id', {
        ascending: true,
      });

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener las áreas: ${error.message}`,
      );
    }

    return (data ?? []).map((area) => this.withImageUrl(area));
  }

  /**
   * Retorna un área activa para la landing.
   */
  async findPublicOne(areaId: number) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.publicColumns)
      .eq('area_id', areaId)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el área: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(
        `No existe un área activa con el ID ${areaId}`,
      );
    }

    return this.withImageUrl(data);
  }

  /**
   * Retorna todas las áreas para el CMS,
   * incluyendo las desactivadas.
   */
  async findAdminAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.adminColumns)
      .order('sort_order', {
        ascending: true,
      })
      .order('area_id', {
        ascending: true,
      });

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener las áreas: ${error.message}`,
      );
    }

    return data ?? [];
  }

  /**
   * Retorna cualquier área para el CMS,
   * independientemente de si está activa o inactiva.
   */
  async findAdminOne(areaId: number) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.adminColumns)
      .eq('area_id', areaId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el área: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`No existe un área con el ID ${areaId}`);
    }

    return data;
  }

  /**
   * Crea una nueva área.
   */
  async create(createAreaDto: CreateAreaDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        name: createAreaDto.name,
        short_name: createAreaDto.short_name ?? null,
        description: createAreaDto.description ?? null,
        image_path: createAreaDto.image_path ?? null,
        icon_key: createAreaDto.icon_key ?? null,
        is_active: createAreaDto.is_active ?? true,
        sort_order: createAreaDto.sort_order ?? 0,

        requirements: createAreaDto.requirements ?? [],
        activities: createAreaDto.activities ?? [],
      })
      .select(this.adminColumns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un área con ese nombre');
      }

      throw new InternalServerErrorException(
        `No se pudo crear el área: ${error.message}`,
      );
    }

    return data;
  }

  /**
   * Actualiza únicamente los campos enviados.
   */
  async update(areaId: number, updateAreaDto: UpdateAreaDto) {
    await this.findAdminOne(areaId);

    const updateData: Record<string, unknown> = {};

    if (updateAreaDto.name !== undefined) {
      updateData.name = updateAreaDto.name;
    }

    if (updateAreaDto.short_name !== undefined) {
      updateData.short_name = updateAreaDto.short_name;
    }

    if (updateAreaDto.description !== undefined) {
      updateData.description = updateAreaDto.description;
    }

    if (updateAreaDto.image_path !== undefined) {
      updateData.image_path = updateAreaDto.image_path;
    }

    if (updateAreaDto.icon_key !== undefined) {
      updateData.icon_key = updateAreaDto.icon_key;
    }

    if (updateAreaDto.is_active !== undefined) {
      updateData.is_active = updateAreaDto.is_active;
    }

    if (updateAreaDto.sort_order !== undefined) {
      updateData.sort_order = updateAreaDto.sort_order;
    }

    if (updateAreaDto.requirements !== undefined) {
      updateData.requirements = updateAreaDto.requirements;
    }

    if (updateAreaDto.activities !== undefined) {
      updateData.activities = updateAreaDto.activities;
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
      .eq('area_id', areaId)
      .select(this.adminColumns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un área con ese nombre');
      }

      throw new InternalServerErrorException(
        `No se pudo actualizar el área: ${error.message}`,
      );
    }

    return data;
  }

  /**
   * Realiza una eliminación lógica.
   *
   * El área no se elimina físicamente porque puede estar
   * relacionada con otros registros del sistema.
   */
  async remove(areaId: number) {
    await this.findAdminOne(areaId);

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        is_active: false,
      })
      .eq('area_id', areaId)
      .select(this.adminColumns)
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo desactivar el área: ${error.message}`,
      );
    }

    return {
      message: 'Área desactivada correctamente',
      area: data,
    };
  }
}
