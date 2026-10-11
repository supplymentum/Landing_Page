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

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name within the organization',
    example: 'Director',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly name!: string;

  @ApiPropertyOptional({
    description: 'Hierarchical order used to display roles',
    example: 3,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly sort_order?: number;

  @ApiPropertyOptional({
    description: 'Indicates whether the role can be used within the organization',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly is_active?: boolean;
}
