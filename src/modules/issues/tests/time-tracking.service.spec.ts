import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TimeEntry } from '../entities/time-entry.entity';
import { Issue } from '../entities/issue.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Provider } from '@nestjs/common';
import { TimeTrackingService } from '../services/time-tracking.service';

describe('TimeTrackingService', () => {
  let service: TimeTrackingService;
  let timeEntryRepository: Repository<TimeEntry>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeTrackingService,
        {
          provide: getRepositoryToken(TimeEntry),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Issue),
          useClass: Repository,
        },
      ] as Provider[],
    }).compile();

    service = module.get<TimeTrackingService>(TimeTrackingService);
    timeEntryRepository = module.get<Repository<TimeEntry>>(
      getRepositoryToken(TimeEntry),
    );
  });

  it('should calculate total time spent correctly with multiple sessions', () => {
    const timeEntries = [
      {
        startTime: new Date('2024-03-10T10:00:00Z'),
        endTime: new Date('2024-03-10T12:00:00Z'),
      },
      {
        startTime: new Date('2024-03-10T14:00:00Z'),
        endTime: new Date('2024-03-10T15:45:00Z'),
      },
    ] as TimeEntry[];

    const totalTime = service.calculateTotalTimeSpent(timeEntries);
    expect(totalTime).toBe('3h 45m');
  });

  it('should handle ongoing time tracking session', async () => {
    const mockStartTime = new Date('2024-03-10T10:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-10T11:30:00Z'));

    const timeEntry = {
      startTime: mockStartTime,
      endTime: null,
    } as TimeEntry;

    jest.spyOn(timeEntryRepository, 'findOne').mockResolvedValue(timeEntry);

    const isTracking = await service.isIssueCurrentlyTracked(1);
    expect(isTracking).toBe(true);

    const currentDuration = service.getCurrentSessionDuration(timeEntry);
    expect(currentDuration).toBe('1h 30m');

    jest.useRealTimers();
  });
});
