import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from '../entities/issue.entity';
import { IssueRepository } from '../repositories/issue.repository';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';
import { TimeTrackingService } from './time-tracking.service';
import { IssueDto } from '../dto/issue.dto';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueRepository)
    private issueRepository: IssueRepository,
    private timeTrackingService: TimeTrackingService,
  ) {}

  private mapToDto(issue: Issue): IssueDto {
    return {
      id: issue.id,
      title: issue.title,
      status: issue.status?.name || 'open',
      totalTimeSpent: this.timeTrackingService.calculateTotalTimeSpent(
        issue.timeEntries || [],
      ),
    };
  }

  async findAll(): Promise<IssueDto[]> {
    const issues = await this.issueRepository.find({
      relations: ['status', 'timeEntries'],
    });
    return issues.map((issue) => this.mapToDto(issue));
  }

  async findByStatus(status: string): Promise<Issue[]> {
    return this.issueRepository.findByStatus(status);
  }

  async create(createIssueDto: CreateIssueDto): Promise<IssueDto> {
    const issue = await this.issueRepository.createIssue(createIssueDto);
    return this.mapToDto(issue);
  }

  async update(id: number, updateIssueDto: UpdateIssueDto): Promise<IssueDto> {
    const issue = await this.issueRepository.updateIssue(id, updateIssueDto);
    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }
    return this.mapToDto(issue);
  }

  async delete(id: number): Promise<void> {
    const result = await this.issueRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }
  }
}
