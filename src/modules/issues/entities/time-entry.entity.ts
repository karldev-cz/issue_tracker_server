import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Issue } from './issue.entity';

@Entity('time_entries')
export class TimeEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Issue, (issue) => issue.timeEntries)
  issue: Issue;

  @Column({ type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
