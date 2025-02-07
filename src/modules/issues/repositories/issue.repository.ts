import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Issue } from '../entities/issue.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';

@Injectable()
export class IssueRepository extends Repository<Issue> {
  constructor(private dataSource: DataSource) {
    super(Issue, dataSource.createEntityManager());
  }

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

  async updateIssue(
    id: number,
    updateIssueDto: UpdateIssueDto,
  ): Promise<Issue> {
    await this.update(id, {
      ...updateIssueDto,
      status: updateIssueDto.status
        ? { name: updateIssueDto.status }
        : undefined,
    });
    return this.findOne({
      where: { id },
      relations: ['status', 'timeEntries'],
    });
  }
}
