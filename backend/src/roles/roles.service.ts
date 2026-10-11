import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

export interface RoleRecord {
  role_id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class RolesService {
  private readonly tableName = 'roles';

  private readonly columns = `
    role_id,
    name,
    sort_order,
    is_active,
    created_at,
    updated_at
  `;

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Obtiene todos los roles para el CMS.
   */
  async findAll(): Promise<RoleRecord[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.columns)
      .order('sort_order', {
        ascending: true,
      })
      .order('role_id', {
        ascending: true,
      });

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener los roles: ${error.message}`,
      );
    }

    return (data ?? []) as RoleRecord[];
  }

  /**
   * Obtiene un rol mediante su ID.
   */
  async findOne(roleId: number): Promise<RoleRecord> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.columns)
      .eq('role_id', roleId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el rol: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`No existe un rol con el ID ${roleId}`);
    }

    return data as RoleRecord;
  }

  /**
   * Crea un nuevo rol dentro de la organización.
   */
  async create(createRoleDto: CreateRoleDto): Promise<RoleRecord> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        name: createRoleDto.name,
        sort_order: createRoleDto.sort_order ?? 0,
        is_active: createRoleDto.is_active ?? true,
      })
      .select(this.columns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }

      throw new InternalServerErrorException(
        `No se pudo crear el rol: ${error.message}`,
      );
    }

    return data as RoleRecord;
  }

  /**
   * Actualiza parcialmente un rol existente.
   */
  async update(
    roleId: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleRecord> {
    await this.findOne(roleId);

    const updateData: Record<string, unknown> = {};

    if (updateRoleDto.name !== undefined) {
      updateData.name = updateRoleDto.name;
    }

    if (updateRoleDto.sort_order !== undefined) {
      updateData.sort_order = updateRoleDto.sort_order;
    }

    if (updateRoleDto.is_active !== undefined) {
      updateData.is_active = updateRoleDto.is_active;
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
      .eq('role_id', roleId)
      .select(this.columns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }

      throw new InternalServerErrorException(
        `No se pudo actualizar el rol: ${error.message}`,
      );
    }

    return data as RoleRecord;
  }

  /**
   * Desactiva un rol sin eliminarlo físicamente.
   */
  async remove(roleId: number) {
    await this.findOne(roleId);

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        is_active: false,
      })
      .eq('role_id', roleId)
      .select(this.columns)
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo desactivar el rol: ${error.message}`,
      );
    }

    return {
      message: 'Rol desactivado correctamente',
      role: data as RoleRecord,
    };
  }
}
