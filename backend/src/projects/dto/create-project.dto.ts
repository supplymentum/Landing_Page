import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Nombre del proyecto',
    example: 'Diagnóstico logístico a mypes de Lima Norte',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly name!: string;

  @ApiProperty({
    description: 'Identificador legible usado en la URL pública',
    example: 'diagnostico-mypes',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  readonly slug!: string;

  @ApiProperty({
    description: 'Categoría del proyecto usada como filtro público',
    example: 'Consultoría',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly area!: string;

  @ApiProperty({
    description: 'Año del proyecto',
    example: 2026,
  })
  @IsInt()
  @Min(2000)
  readonly year!: number;

  @ApiPropertyOptional({
    description: 'Descripción breve del proyecto',
    example: 'Consultoría gratuita de procesos logísticos para pequeñas empresas.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional({
    description: 'Ruta de la imagen del proyecto en Supabase Storage',
    example: 'projects/diagnostico-mypes.webp',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly image_path?: string;

  @ApiPropertyOptional({
    description: 'Indica si el proyecto aparece en la banda de destacados',
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly starred?: boolean;

  @ApiPropertyOptional({
    description: 'Indica si el proyecto se muestra en la página pública',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Orden de visualización. Los menores se muestran primero.',
    default: 0,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly sort_order?: number;
}
