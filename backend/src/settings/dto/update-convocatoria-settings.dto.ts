import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConvocatoriaSettingsDto {
  @ApiPropertyOptional({
    description: 'If the convocatoria is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Deadline of the convocatoria in ISO string format',
    example: '2026-08-15T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({
    description: 'Main title of the hero section',
    example: 'Únete a SupplyMentum UNI',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Subtitle/description of the hero section',
    example: 'La convocatoria está abierta. El tiempo corre.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
