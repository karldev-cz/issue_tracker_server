import { IsString, IsOptional, IsEnum } from 'class-validator';

enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

export class UpdateIssueDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;
}
