import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum table for issue statuses
    await queryRunner.query(`
            CREATE TABLE issue_statuses (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL
            );
        `);

    // Insert possible statuses
    await queryRunner.query(`
            INSERT INTO issue_statuses (name) VALUES
                ('open'),
                ('in_progress'),
                ('closed');
        `);

    // Create issues table
    await queryRunner.query(`
            CREATE TABLE issues (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                status_id INTEGER NOT NULL REFERENCES issue_statuses(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Create time entries table
    await queryRunner.query(`
            CREATE TABLE time_entries (
                id SERIAL PRIMARY KEY,
                issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
                start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                end_time TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Create indexes
    await queryRunner.query(`
            CREATE INDEX idx_issues_status ON issues(status_id);
            CREATE INDEX idx_time_entries_issue ON time_entries(issue_id);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_time_entries_issue`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_issues_status`);
    await queryRunner.query(`DROP TABLE IF EXISTS time_entries`);
    await queryRunner.query(`DROP TABLE IF EXISTS issues`);
    await queryRunner.query(`DROP TABLE IF EXISTS issue_statuses`);
  }
}
