import { EntityRepository, Repository } from 'typeorm';
import { Issue } from '../entities/issue.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';

@EntityRepository(Issue)
export class IssueRepository extends Repository<Issue> {
  async findByStatus(status: string): Promise<Issue[]> {
    return this.createQueryBuilder('issue')
      .leftJoinAndSelect('issue.status', 'status')
      .leftJoinAndSelect('issue.timeEntries', 'timeEntries')
      .where('status.name = :status', { status })
      .getMany();
  }

  async createIssue(createIssueDto: CreateIssueDto): Promise<Issue> {
    const issue = this.create(createIssueDto);
    return this.save(issue);
  }

  async updateIssue(id: number, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    await this.update(id, updateIssueDto);
    return this.findOne(id);
  }
} 