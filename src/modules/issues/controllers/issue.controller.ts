import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { IssueService } from '../services/issue.service';
import { TimeTrackingService } from '../services/time-tracking.service';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';
import { IssueDto } from '../dto/issue.dto';
import { TimeEntry } from '../entities/time-entry.entity';

@Controller('issues')
export class IssueController {
  constructor(
    private readonly issueService: IssueService,
    private readonly timeTrackingService: TimeTrackingService,
  ) {}

  @Get()
  async findAll(): Promise<IssueDto[]> {
    return this.issueService.findAll();
  }

  @Post()
  async create(@Body() createIssueDto: CreateIssueDto): Promise<IssueDto> {
    return this.issueService.create(createIssueDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<IssueDto> {
    return this.issueService.update(id, updateIssueDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.issueService.delete(id);
  }

  @Post(':id/start')
  async startTracking(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TimeEntry> {
    return this.timeTrackingService.startTracking(id);
  }

  @Post(':id/stop')
  async stopTracking(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TimeEntry> {
    return this.timeTrackingService.stopTracking(id);
  }

  @Get(':id/status')
  async getTrackingStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ isRunning: boolean }> {
    const isRunning =
      await this.timeTrackingService.isIssueCurrentlyTracked(id);
    return { isRunning };
  }
}
