export class IssueDto {
  id: number;
  title: string;
  description?: string;
  status: string;
  totalTimeSpent: string;
  createdAt: Date;
  updatedAt: Date;
}
