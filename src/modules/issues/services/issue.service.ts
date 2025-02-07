import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from '../entities/issue.entity';
import { IssueRepository } from '../repositories/issue.repository';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';
import { TimeTrackingService } from './time-tracking.service';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueRepository)
    private issueRepository: IssueRepository,
    private timeTrackingService: TimeTrackingService,
  ) {}

  async findAll(): Promise<Issue[]> {
    return this.issueRepository.find({
      relations: ['status', 'timeEntries'],
    });
  }

  async findByStatus(status: string): Promise<Issue[]> {
    return this.issueRepository.findByStatus(status);
  }

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    return this.issueRepository.createIssue(createIssueDto);
  }
  async update(id: number, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const issue = await this.issueRepository.findOne({
      where: { id },
    });
    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }
    return this.issueRepository.updateIssue(id, updateIssueDto);
  }

  async delete(id: number): Promise<void> {
    const result = await this.issueRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }
  }
}
