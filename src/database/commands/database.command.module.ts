import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { DatabaseMigrationCommand } from './database.migration.command';

@Module({
  imports: [CommandModule],
  providers: [DatabaseMigrationCommand],
})
export class DatabaseCommandModule {}
