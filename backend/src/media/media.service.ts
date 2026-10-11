import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { SupabaseService } from '../supabase/supabase.service';

import { MEDIA_RESOURCES, MediaResource } from './dto/upload-media.dto';

export interface UploadedMedia {
  image_path: string;
  image_url: string;
}

export interface ListedMedia {
  name: string;
  image_path: string;
  image_url: string;
  resource: MediaResource;
  created_at: string | null;
  updated_at: string | null;
  size: number | null;
  mime_type: string | null;
}

@Injectable()
export class MediaService {
  private readonly bucketName = 'cms-media';

  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Obtiene la extensión correspondiente
   * al tipo MIME del archivo.
   */
  private getExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';

      case 'image/png':
        return 'png';

      case 'image/webp':
        return 'webp';

      default:
        throw new BadRequestException('Formato de imagen no permitido');
    }
  }

  /**
   * Valida que el recurso corresponda
   * a una carpeta permitida.
   */
  private validateResource(
    resource: string,
  ): asserts resource is MediaResource {
    if (!MEDIA_RESOURCES.includes(resource as MediaResource)) {
      throw new BadRequestException('El tipo de recurso no es válido');
    }
  }

  /**
   * Valida el tipo MIME del archivo.
   */
  private validateMimeType(mimeType: string): void {
    if (!this.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(
        'Solo se permiten imágenes JPEG, PNG o WebP',
      );
    }
  }

  /**
   * Valida que una ruta pertenezca
   * a una carpeta administrada por el CMS.
   */
  private validateImagePath(imagePath: string): void {
    if (
      imagePath.includes('..') ||
      imagePath.startsWith('/') ||
      imagePath.includes('\\')
    ) {
      throw new BadRequestException('La ruta de la imagen no es válida');
    }

    const parts = imagePath.split('/');

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new BadRequestException('La ruta de la imagen no es válida');
    }

    this.validateResource(parts[0]);
  }

  /**
   * Genera la URL pública correspondiente
   * a una imagen almacenada en Supabase.
   */
  getPublicUrl(imagePath: string): string {
    this.validateImagePath(imagePath);

    const supabase = this.supabaseService.getClient();

    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(imagePath);

    return data.publicUrl;
  }

  /**
   * Lista los archivos de una carpeta
   * específica del bucket.
   */
  private async listResource(resource: MediaResource): Promise<ListedMedia[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .list(resource, {
        limit: 1000,
        offset: 0,
        sortBy: {
          column: 'created_at',
          order: 'desc',
        },
      });

    if (error) {
      throw new InternalServerErrorException(
        `No se pudieron obtener las imágenes de ${resource}: ${error.message}`,
      );
    }

    return (data ?? [])
      .filter((file) => {
        /*
         * Supabase también puede devolver carpetas.
         * Los archivos reales tienen metadata.
         */
        return file.metadata;
      })
      .map((file) => {
        const imagePath = `${resource}/${file.name}`;

        return {
          name: file.name,
          image_path: imagePath,
          image_url: this.getPublicUrl(imagePath),
          resource,
          created_at: file.created_at ?? null,
          updated_at: file.updated_at ?? null,
          size:
            typeof file.metadata?.size === 'number' ? file.metadata.size : null,
          mime_type:
            typeof file.metadata?.mimetype === 'string'
              ? file.metadata.mimetype
              : null,
        };
      });
  }

  /**
   * Lista las imágenes almacenadas
   * en el bucket del CMS.
   *
   * Si se especifica resource,
   * devuelve únicamente esa carpeta.
   *
   * Si no se especifica,
   * combina las imágenes de todos
   * los recursos disponibles.
   */
  async findAll(resource?: string): Promise<ListedMedia[]> {
    if (resource) {
      this.validateResource(resource);

      return this.listResource(resource);
    }

    const resources = MEDIA_RESOURCES;

    const mediaByResource = await Promise.all(
      resources.map((currentResource) => this.listResource(currentResource)),
    );

    return mediaByResource.flat().sort((a, b) => {
      if (!a.created_at && !b.created_at) {
        return 0;
      }

      if (!a.created_at) {
        return 1;
      }

      if (!b.created_at) {
        return -1;
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }

  /**
   * Sube una imagen a Supabase Storage.
   */
  async upload(
    file: Express.Multer.File,
    resource: MediaResource,
  ): Promise<UploadedMedia> {
    if (!file) {
      throw new BadRequestException('Debe proporcionar una imagen');
    }

    this.validateResource(resource);

    this.validateMimeType(file.mimetype);

    const extension = this.getExtension(file.mimetype);

    const fileName = `${randomUUID()}.${extension}`;

    const imagePath = `${resource}/${fileName}`;

    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.storage
      .from(this.bucketName)
      .upload(imagePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo subir la imagen: ${error.message}`,
      );
    }

    const imageUrl = this.getPublicUrl(imagePath);

    return {
      image_path: imagePath,
      image_url: imageUrl,
    };
  }

  /**
   * Elimina una imagen de Supabase Storage.
   */
  async remove(imagePath: string): Promise<{
    message: string;
    image_path: string;
  }> {
    this.validateImagePath(imagePath);

    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([imagePath]);

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo eliminar la imagen: ${error.message}`,
      );
    }

    return {
      message: 'Imagen eliminada correctamente',
      image_path: imagePath,
    };
  }
}
