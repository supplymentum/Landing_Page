import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const MEDIA_RESOURCES = [
  'areas',
  'events',
  'executives',
  'projects',
] as const;

export type MediaResource = (typeof MEDIA_RESOURCES)[number];

export class UploadMediaDto {
  @ApiProperty({
    description: 'Resource type the image belongs to',
    example: 'executives',
    enum: MEDIA_RESOURCES,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(MEDIA_RESOURCES)
  readonly resource!: MediaResource;
}
