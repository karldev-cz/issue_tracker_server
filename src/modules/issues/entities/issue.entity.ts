import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IssueStatus } from './issue-status.entity';
import { TimeEntry } from './time-entry.entity';

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne('IssueStatus', 'issues')
  status: IssueStatus;

  @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.issue)
  timeEntries: TimeEntry[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
