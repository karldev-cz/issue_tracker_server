import { Injectable } from '@nestjs/common';
import { DataSource, Repository, DeepPartial } from 'typeorm';
import { Issue } from '../entities/issue.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';
import {
  getStatusIdByName,
  ISSUE_STATUSES,
} from '../constants/issue-status.constants';

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
    const issue = this.create({
      ...createIssueDto,
      statusId: ISSUE_STATUSES.OPEN.id,
    });

    return this.save(issue);
  }

  async updateIssue(
    id: number,
    updateIssueDto: UpdateIssueDto,
  ): Promise<Issue> {
    const updateData: DeepPartial<Issue> = {
      title: updateIssueDto.title,
      description: updateIssueDto.description,
    };

    if (updateIssueDto.status) {
      updateData.statusId = getStatusIdByName(updateIssueDto.status);
    }

    await this.update(id, updateData);

    return this.findOne({
      where: { id },
      relations: ['status', 'timeEntries'],
    });
  }
}
