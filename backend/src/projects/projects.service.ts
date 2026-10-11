import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { MediaService } from '../media/media.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

export interface ProjectRecord {
  project_id: number;
  name: string;
  slug: string;
  area: string;
  year: number;
  description: string | null;
  image_path: string | null;
  starred: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable()
export class ProjectsService {
  private readonly tableName = 'projects';

  private readonly publicColumns = `
    project_id,
    name,
    slug,
    area,
    year,
    description,
    image_path,
    starred,
    sort_order
  `;

  private readonly adminColumns = `
    project_id,
    name,
    slug,
    area,
    year,
    description,
    image_path,
    starred,
    is_active,
    sort_order,
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
   * Retorna los proyectos visibles para la landing.
   *
   * Orden: destacados primero, luego año descendente y
   * finalmente el orden de visualización configurado.
   */
  async findPublicAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.publicColumns)
      .eq('is_active', true)
      .order('starred', { ascending: false })
      .order('year', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener los proyectos: ${error.message}`,
      );
    }

    return (data ?? []).map((project) => this.withImageUrl(project));
  }

  /**
   * Retorna un proyecto activo para la landing mediante su slug.
   */
  async findPublicOne(slug: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.publicColumns)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el proyecto: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`No existe un proyecto con el slug ${slug}`);
    }

    return this.withImageUrl(data);
  }

  /**
   * Retorna todos los proyectos para el CMS.
   */
  async findAdminAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.adminColumns)
      .order('starred', { ascending: false })
      .order('year', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener los proyectos: ${error.message}`,
      );
    }

    return (data ?? []).map((project) => this.withImageUrl(project));
  }

  /**
   * Retorna un proyecto para el CMS.
   */
  async findAdminOne(projectId: number): Promise<ProjectRecord> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.adminColumns)
      .eq('project_id', projectId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo obtener el proyecto: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(
        `No existe un proyecto con el ID ${projectId}`,
      );
    }

    return this.withImageUrl(data);
  }

  /**
   * Crea un nuevo proyecto.
   */
  async create(createProjectDto: CreateProjectDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        name: createProjectDto.name,
        slug: createProjectDto.slug,
        area: createProjectDto.area,
        year: createProjectDto.year,
        description: createProjectDto.description ?? null,
        image_path: createProjectDto.image_path ?? null,
        starred: createProjectDto.starred ?? false,
        is_active: createProjectDto.is_active ?? true,
        sort_order: createProjectDto.sort_order ?? 0,
      })
      .select(this.adminColumns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Ya existe un proyecto con el slug ${createProjectDto.slug}`,
        );
      }

      throw new InternalServerErrorException(
        `No se pudo crear el proyecto: ${error.message}`,
      );
    }

    return this.withImageUrl(data);
  }

  /**
   * Actualiza parcialmente un proyecto.
   */
  async update(projectId: number, updateProjectDto: UpdateProjectDto) {
    await this.findAdminOne(projectId);

    const updateData: Record<string, unknown> = {};

    const fields = [
      'name',
      'slug',
      'area',
      'year',
      'description',
      'image_path',
      'starred',
      'is_active',
      'sort_order',
    ] as const;

    for (const field of fields) {
      if (updateProjectDto[field] !== undefined) {
        updateData[field] = updateProjectDto[field];
      }
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
      .eq('project_id', projectId)
      .select(this.adminColumns)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un proyecto con ese slug');
      }

      throw new InternalServerErrorException(
        `No se pudo actualizar el proyecto: ${error.message}`,
      );
    }

    return this.withImageUrl(data);
  }

  /**
   * Elimina un proyecto.
   */
  async remove(projectId: number) {
    await this.findAdminOne(projectId);

    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('project_id', projectId);

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo eliminar el proyecto: ${error.message}`,
      );
    }

    return {
      message: 'Proyecto eliminado correctamente',
      project_id: projectId,
    };
  }
}
