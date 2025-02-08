import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from '../entities/time-entry.entity';
import { Issue } from '../entities/issue.entity';

@Injectable()
export class TimeTrackingService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepository: Repository<TimeEntry>,
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
  ) {}

  async startTracking(issueId: number): Promise<TimeEntry> {
    const issue = await this.issueRepository.findOne({
      where: { id: issueId },
    });
    if (!issue) {
      throw new NotFoundException(`Issue with ID ${issueId} not found`);
    }

    const activeSession = await this.findActiveSession(issueId);
    if (activeSession) {
      throw new ConflictException(
        'Time tracking is already active for this issue',
      );
    }

    const timeEntry = this.timeEntryRepository.create({
      issue,
      startTime: new Date(),
    });

    return this.timeEntryRepository.save(timeEntry);
  }

  async stopTracking(issueId: number): Promise<TimeEntry> {
    const activeSession = await this.findActiveSession(issueId);
    if (!activeSession) {
      throw new BadRequestException(
        'No active time tracking session found for this issue',
      );
    }

    activeSession.endTime = new Date();
    await this.timeEntryRepository.save(activeSession);

    return this.timeEntryRepository.findOne({
      where: { id: activeSession.id },
      relations: ['issue', 'issue.timeEntries'],
    });
  }

  calculateTotalTimeSpent(timeEntries: TimeEntry[]): string {
    let totalMinutes = 0;

    for (const entry of timeEntries) {
      if (entry.startTime && entry.endTime) {
        const duration = entry.endTime.getTime() - entry.startTime.getTime();
        totalMinutes += duration / (1000 * 60);
      }
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return `${hours}h ${minutes}m`;
  }

  private async findActiveSession(issueId: number): Promise<TimeEntry | null> {
    return this.timeEntryRepository
      .createQueryBuilder('timeEntry')
      .leftJoinAndSelect('timeEntry.issue', 'issue')
      .leftJoinAndSelect('issue.timeEntries', 'timeEntries')
      .where('issue.id = :issueId', { issueId })
      .andWhere('timeEntry.endTime IS NULL')
      .getOne();
  }

  async isIssueCurrentlyTracked(issueId: number): Promise<boolean> {
    const activeSession = await this.findActiveSession(issueId);
    return !!activeSession;
  }

  getCurrentSessionDuration(timeEntry: TimeEntry): string {
    if (!timeEntry.startTime || timeEntry.endTime) {
      return '0h 0m';
    }

    const duration = new Date().getTime() - timeEntry.startTime.getTime();
    const minutes = duration / (1000 * 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);

    return `${hours}h ${remainingMinutes}m`;
  }
}
