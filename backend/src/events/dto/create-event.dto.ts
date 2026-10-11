import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Título del evento',
    example: 'Supply Chain Challenge 2026',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly title!: string;

  @ApiProperty({
    description: 'Descripción del evento',
    example:
      'Evento dirigido a estudiantes interesados en logística y supply chain.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @ApiProperty({
    description: 'Lugar donde se realizará el evento',
    example: 'Universidad de Lima',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  readonly location!: string;

  @ApiPropertyOptional({
    description: 'Ruta de la imagen del evento en Supabase Storage',
    example: 'events/supply-chain-challenge-2026.webp',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly image_path?: string;

  @ApiPropertyOptional({
    description:
      'Enlace de inscripción. Es obligatorio cuando is_active es true.',
    example: 'https://forms.example.com/evento',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  readonly registration_link?: string;

  @ApiPropertyOptional({
    description:
      'Enlace con el resumen, resultados o contenido posterior del evento',
    example: 'https://example.com/eventos/resumen',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  readonly summary_link?: string;

  @ApiProperty({
    description: 'Fecha y hora de inicio del evento en formato ISO 8601',
    example: '2026-09-15T19:00:00-05:00',
  })
  @IsISO8601()
  readonly start_date_time!: string;

  @ApiPropertyOptional({
    description: 'Indica si las inscripciones al evento se encuentran abiertas',
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Indica si el evento debe aparecer destacado',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly starred?: boolean;
}
