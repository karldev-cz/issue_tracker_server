import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueService } from './modules/issues/services/issue.service';
import { TimeTrackingService } from './modules/issues/services/time-tracking.service';
import { Issue } from './modules/issues/entities/issue.entity';
import { IssueStatus } from './modules/issues/entities/issue-status.entity';
import { TimeEntry } from './modules/issues/entities/time-entry.entity';
import { IssueRepository } from './modules/issues/repositories/issue.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Issue, IssueStatus, TimeEntry],
        migrations: ['dist/migrations/*{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Issue, IssueStatus, TimeEntry]),
  ],
  providers: [IssueService, TimeTrackingService, IssueRepository],
  exports: [IssueService, TimeTrackingService],
})
export class AppModule {}
