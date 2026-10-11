import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const APPLICANT_STATUSES = [
  'pendiente',
  'aceptado',
  'rechazado',
] as const;

export type ApplicantStatus = (typeof APPLICANT_STATUSES)[number];

export class UpdateApplicantStatusDto {
  @ApiProperty({
    description: 'Review status of the application',
    enum: APPLICANT_STATUSES,
    example: 'rechazado',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(APPLICANT_STATUSES)
  readonly status!: ApplicantStatus;
}
