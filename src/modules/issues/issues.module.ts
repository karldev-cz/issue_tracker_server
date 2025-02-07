import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueService } from './services/issue.service';
import { TimeTrackingService } from './services/time-tracking.service';
import { Issue } from './entities/issue.entity';
import { IssueStatus } from './entities/issue-status.entity';
import { TimeEntry } from './entities/time-entry.entity';
import { IssueRepository } from './repositories/issue.repository';
import { IssueController } from './controllers/issue.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue, IssueStatus, TimeEntry, IssueRepository]),
  ],
  controllers: [IssueController],
  providers: [IssueService, TimeTrackingService],
  exports: [IssueService, TimeTrackingService],
})
export class IssuesModule {} 