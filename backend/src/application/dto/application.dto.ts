import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApplicationDto {
  @ApiProperty({
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  readonly first_name!: string;

  @ApiProperty({
    example: 'Pérez',
  })
  @IsString()
  @IsNotEmpty()
  readonly last_name!: string;

  @ApiPropertyOptional({
    description:
      'Se ignora: el correo se toma de la sesión de Google del postulante.',
    example: 'juan.perez@example.com',
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    example: '987654321',
  })
  @IsString()
  @IsNotEmpty()
  readonly phone!: string;

  @ApiProperty({
    example: 'Ingeniería de Sistemas',
  })
  @IsString()
  @IsNotEmpty()
  readonly career!: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  readonly first_choice_area_id!: number;

  @ApiProperty({
    description: 'Código de estudiante UNI',
    example: '20211234A',
  })
  @IsString()
  @IsNotEmpty()
  readonly codigo_uni!: string;

  @ApiProperty({
    example: '8',
  })
  @IsString()
  @IsNotEmpty()
  readonly university_semester!: string;

  @ApiProperty({
    example: 'Me interesa formar parte de la organización.',
  })
  @IsString()
  @IsNotEmpty()
  readonly application_reason!: string;

  @ApiPropertyOptional({
    example: 2,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  readonly second_choice_area_id?: number;
}
