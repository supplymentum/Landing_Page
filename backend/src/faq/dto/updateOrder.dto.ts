import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ description: 'FAQ entry ID', example: 1 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly faq_id: number;

  @ApiProperty({ description: 'New display order', example: 2 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly orden: number;
}
