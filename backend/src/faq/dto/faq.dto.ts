import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FaqDto {
  @ApiProperty({
    description: 'Question text',
    example: '¿Cómo puedo postular a SupplyMentum?',
  })
  @IsString()
  @IsNotEmpty()
  readonly pregunta: string;

  @ApiProperty({
    description: 'Answer text',
    example: 'A través del formulario de convocatoria publicado en la web.',
  })
  @IsString()
  @IsNotEmpty()
  readonly respuesta: string;
}
