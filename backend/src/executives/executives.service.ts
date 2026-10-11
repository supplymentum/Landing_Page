import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { SupabaseService } from '../supabase/supabase.service';
import { MediaService } from '../media/media.service';

import { CreateExecutiveDto } from './dto/create-executive.dto';
import { UpdateExecutiveDto } from './dto/update-executive.dto';

export interface ExecutiveRole {
  role_id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export interface ExecutiveArea {
  area_id: number;
  name: string;
  short_name: string | null;
}

export interface ExecutiveRecord {
  executive_id: number;
  full_name: string;
  role_id: number;
  area_id: number | null;
  description: string | null;
  image_path: string | null;
  linkedin_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  role?: ExecutiveRole | null;
  area?: ExecutiveArea | null;
}

@Injectable()
export class ExecutivesService {
  private readonly tableName = 'executives';

  private readonly publicColumns = `
    executive_id,
    full_name,
    role_id,
    area_id,
    description,
    image_path,
    linkedin_url,
    sort_order,
    role:roles (
      role_id,
      name,
      sort_order,
      is_active
    ),
    area:areas (
      area_id,
      name,
      short_name
    )
  `;

  private readonly adminColumns = `
    executive_id,
    full_name,
    role_id,
    area_id,
    description,
    image_path,
    linkedin_url,
    is_active,
    sort_order,
    created_at,
    updated_at,
    role:roles (
      role_id,
      name,
      sort_order,
      is_active
    ),
    area:areas (
      area_id,
      name,
      short_name
    )
  `;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Agrega la URL pública de la imagen a partir de image_path.
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
   * Ordena los directivos según la jerarquía del rol
   * y posteriormente por el orden individual del directivo.
   */
  private sortExecutives(executives: ExecutiveRecord[]): ExecutiveRecord[] {
    return [...executives].sort((a, b) => {
      const roleOrderA = a.role?.sort_order ?? Number.MAX_SAFE_INTEGER;

      const roleOrderB = b.role?.sort_order ?? Number.MAX_SAFE_INTEGER;

      if (roleOrderA !== roleOrderB) {
        return roleOrderA - roleOrderB;
      }

      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }

      return a.executive_id - b.executive_id;
    });
  }

  /**
   * Verifica que el rol exista y esté activo.
   */
  private async validateRole(roleId: number): Promise<void> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('roles')
      .select('role_id, is_active')
      .eq('role_id', roleId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo validar el rol: ${error.message}`,
      );
    }

    if (!data) {
      throw new BadRequestException(`No existe un rol con el ID ${roleId}`);
    }

    if (!data.is_active) {
      throw new BadRequestException(
        `El rol con ID ${roleId} se encuentra desactivado`,
      );
    }
  }

  /**
   * Verifica que el área exista y esté activa.
   */
  private async validateArea(areaId: number): Promise<void> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('areas')
      .select('area_id, is_active')
      .eq('area_id', areaId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo validar el área: ${error.message}`,
      );
    }

    if (!data) {
      throw new BadRequestException(`No existe un área con el ID ${areaId}`);
    }

    if (!data.is_active) {
      throw new BadRequestException(
        `El área con ID ${areaId} se encuentra desactivada`,
      );
    }
  }

  /**
   * Obtiene los directivos visibles en la landing.
   */
  async findPublicAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.publicColumns)
      .eq('is_active', true);

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener los directivos: ${error.message}`,
      );
    }

    const executives = (data ?? []) as unknown as ExecutiveRecord[];

    const visibleExecutives = executives.filter(
      (executive) => executive.role && executive.role.is_active,
    );

    const sortedExecutives = this.sortExecutives(visibleExecutives);

    return sortedExecutives.map((executive) => this.withImageUrl(executive));
  }

  /**
   * Obtiene un directivo activo para la landing.
   */
  async findPublicOne(executiveId: number) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.publicColumns)
      .eq('executive_id', executiveId)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el directivo: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(
        `No existe un directivo activo con el ID ${executiveId}`,
      );
    }

    const executive = data as unknown as ExecutiveRecord;

    if (!executive.role?.is_active) {
      throw new NotFoundException(
        `No existe un directivo activo con el ID ${executiveId}`,
      );
    }

    return this.withImageUrl(executive);
  }

  /**
   * Obtiene todos los directivos para el CMS,
   * incluyendo los desactivados.
   */
  async findAdminAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.adminColumns);

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener los directivos: ${error.message}`,
      );
    }

    const executives = (data ?? []) as unknown as ExecutiveRecord[];

    return this.sortExecutives(executives);
  }

  /**
   * Obtiene cualquier directivo mediante su ID.
   */
  async findAdminOne(executiveId: number): Promise<ExecutiveRecord> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.adminColumns)
      .eq('executive_id', executiveId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el directivo: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(
        `No existe un directivo con el ID ${executiveId}`,
      );
    }

    return data as unknown as ExecutiveRecord;
  }

  /**
   * Crea un nuevo directivo.
   */
  async create(createExecutiveDto: CreateExecutiveDto) {
    await this.validateRole(createExecutiveDto.role_id);

    if (
      createExecutiveDto.area_id !== undefined &&
      createExecutiveDto.area_id !== null
    ) {
      await this.validateArea(createExecutiveDto.area_id);
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        full_name: createExecutiveDto.full_name,

        role_id: createExecutiveDto.role_id,

        area_id: createExecutiveDto.area_id ?? null,

        description: createExecutiveDto.description ?? null,

        image_path: createExecutiveDto.image_path ?? null,

        linkedin_url: createExecutiveDto.linkedin_url ?? null,

        is_active: createExecutiveDto.is_active ?? true,

        sort_order: createExecutiveDto.sort_order ?? 0,
      })
      .select(this.adminColumns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un directivo con esos datos');
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          'El rol o el área especificada no existe',
        );
      }

      throw new InternalServerErrorException(
        `No se pudo crear el directivo: ${error.message}`,
      );
    }

    return data;
  }

  /**
   * Actualiza parcialmente un directivo existente.
   */
  async update(executiveId: number, updateExecutiveDto: UpdateExecutiveDto) {
    await this.findAdminOne(executiveId);

    if (updateExecutiveDto.role_id !== undefined) {
      await this.validateRole(updateExecutiveDto.role_id);
    }

    if (
      updateExecutiveDto.area_id !== undefined &&
      updateExecutiveDto.area_id !== null
    ) {
      await this.validateArea(updateExecutiveDto.area_id);
    }

    const updateData: Record<string, unknown> = {};

    if (updateExecutiveDto.full_name !== undefined) {
      updateData.full_name = updateExecutiveDto.full_name;
    }

    if (updateExecutiveDto.role_id !== undefined) {
      updateData.role_id = updateExecutiveDto.role_id;
    }

    if (updateExecutiveDto.area_id !== undefined) {
      updateData.area_id = updateExecutiveDto.area_id;
    }

    if (updateExecutiveDto.description !== undefined) {
      updateData.description = updateExecutiveDto.description;
    }

    if (updateExecutiveDto.image_path !== undefined) {
      updateData.image_path = updateExecutiveDto.image_path;
    }

    if (updateExecutiveDto.linkedin_url !== undefined) {
      updateData.linkedin_url = updateExecutiveDto.linkedin_url;
    }

    if (updateExecutiveDto.is_active !== undefined) {
      updateData.is_active = updateExecutiveDto.is_active;
    }

    if (updateExecutiveDto.sort_order !== undefined) {
      updateData.sort_order = updateExecutiveDto.sort_order;
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
      .eq('executive_id', executiveId)
      .select(this.adminColumns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un directivo con esos datos');
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          'El rol o el área especificada no existe',
        );
      }

      throw new InternalServerErrorException(
        `No se pudo actualizar el directivo: ${error.message}`,
      );
    }

    return data;
  }

  /**
   * Desactiva un directivo sin eliminarlo físicamente.
   */
  async remove(executiveId: number) {
    await this.findAdminOne(executiveId);

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        is_active: false,
      })
      .eq('executive_id', executiveId)
      .select(this.adminColumns)
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo desactivar el directivo: ${error.message}`,
      );
    }

    return {
      message: 'Directivo desactivado correctamente',
      executive: data,
    };
  }
}
