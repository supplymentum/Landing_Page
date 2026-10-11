import { Transform } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAreaDto {
  @ApiProperty({
    description: 'Full area name',
    example: 'Capital Humano y Excelencia',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  readonly name!: string;

  @ApiPropertyOptional({
    description: 'Short name or abbreviation for the area',
    example: 'CHE',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly short_name?: string;

  @ApiPropertyOptional({
    description: 'Area description that may be displayed on the landing page',
    example:
      'Area responsable del desarrollo del talento y la cultura organizacional.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @ApiPropertyOptional({
    description:
      'Path of the image associated with the area in Supabase Storage',
    example: 'areas/capital-humano.webp',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly image_path?: string;

  @ApiPropertyOptional({
    description: 'Key used by the frontend to render the area icon',
    example: 'che',
    maxLength: 50,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly icon_key?: string;

  @ApiPropertyOptional({
    description: 'List of activities carried out by the area',
    example: [
      'Organización de eventos',
      'Desarrollo de proyectos',
      'Capacitaciones',
    ],
    type: [String],
    default: [],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly activities?: string[];

  @ApiPropertyOptional({
    description:
      'List of characteristics or skills sought in members of the area',
    example: [
      'Trabajo en equipo',
      'Responsabilidad',
      'Interés por supply chain',
    ],
    type: [String],
    default: [],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly requirements?: string[];

  @ApiPropertyOptional({
    description: 'Determines whether the area is visible on the landing page',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Display order of the area on the landing page',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly sort_order?: number;
}
