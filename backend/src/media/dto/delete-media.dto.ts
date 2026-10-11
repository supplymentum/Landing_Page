import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMediaDto {
  @ApiProperty({
    description: 'Path of the file to delete from Supabase Storage',
    example: 'executives/550e8400-e29b-41d4-a716-446655440000.webp',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  readonly image_path!: string;
}
