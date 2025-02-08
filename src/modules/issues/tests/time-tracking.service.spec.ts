import { Test, TestingModule } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TimeEntry } from '../entities/time-entry.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Provider } from '@nestjs/common';
import { TimeTrackingService } from '../services/time-tracking.service';
import { Issue } from '../entities/issue.entity';

describe('TimeTrackingService', () => {
  let service: TimeTrackingService;
  let timeEntryRepository: Repository<TimeEntry>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeTrackingService,
        {
          provide: getRepositoryToken(TimeEntry),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(Issue),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ] as Provider[],
    }).compile();

    service = module.get<TimeTrackingService>(TimeTrackingService);
    timeEntryRepository = module.get<Repository<TimeEntry>>(
      getRepositoryToken(TimeEntry),
    );
  });

  it('should handle ongoing time tracking session', async () => {
    const mockStartTime = new Date('2024-03-10T10:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-10T11:30:00Z'));

    const mockTimeEntry = {
      startTime: mockStartTime,
      endTime: null,
    } as TimeEntry;

    const queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockTimeEntry),
    } as unknown as SelectQueryBuilder<TimeEntry>;

    jest
      .spyOn(timeEntryRepository, 'createQueryBuilder')
      .mockReturnValue(queryBuilder);

    const isTracking = await service.isIssueCurrentlyTracked(1);
    expect(isTracking).toBe(true);

    const currentDuration = service.getCurrentSessionDuration(mockTimeEntry);
    expect(currentDuration).toBe('1h 30m');

    jest.useRealTimers();
  });

  it('should calculate total time spent correctly with multiple time entries', () => {
    const timeEntries = [
      {
        startTime: new Date('2024-03-10T10:00:00Z'),
        endTime: new Date('2024-03-10T12:30:00Z'),
      },
      {
        startTime: new Date('2024-03-10T14:00:00Z'),
        endTime: new Date('2024-03-10T16:45:00Z'),
      },
      {
        startTime: new Date('2024-03-11T09:00:00Z'),
        endTime: new Date('2024-03-11T10:15:00Z'),
      },
    ] as TimeEntry[];

    const totalTime = service.calculateTotalTimeSpent(timeEntries);
    expect(totalTime).toBe('6h 30m');
  });

  it('should return zero duration for empty time entries array', () => {
    const timeEntries = [] as TimeEntry[];

    const totalTime = service.calculateTotalTimeSpent(timeEntries);
    expect(totalTime).toBe('0h 0m');
  });
});
