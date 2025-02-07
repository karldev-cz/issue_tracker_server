import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Issue } from './issue.entity';

@Entity('issue_statuses')
export class IssueStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany('Issue', 'status')
  issues: Promise<Issue[]>;
}
