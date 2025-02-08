import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
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

  @Column({ name: 'status_id' })
  statusId: number;

  @ManyToOne(() => IssueStatus)
  @JoinColumn({ name: 'status_id' })
  status: IssueStatus;

  @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.issue)
  timeEntries: TimeEntry[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
