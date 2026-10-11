import { PartialType } from '@nestjs/swagger';
import { CreateExecutiveDto } from './create-executive.dto';

export class UpdateExecutiveDto extends PartialType(CreateExecutiveDto) {}
