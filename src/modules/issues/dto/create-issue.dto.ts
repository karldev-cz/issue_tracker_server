import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  // status_id is set automatically, not part of the DTO
}
