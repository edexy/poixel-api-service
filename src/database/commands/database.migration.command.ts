import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import { Command, Option } from 'nestjs-command';
import * as path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class DatabaseMigrationCommand {
  migrationPath = 'src/database/migrations/public';

  @Command({
    command: 'migration:create',
    describe: 'create migration',
  })
  async createMigration(
    @Option({
      name: 'name',
      alias: 'n',
      describe: 'Entity name',
      type: 'string',
      requiresArg: true,
      demandOption: true,
    })
    entityName: string,
  ) {
    console.log('creating migration...');
    await this.execute('migration:create', entityName);
  }

  @Command({
    command: 'migration:generate',
    describe: 'generate migration for one entity',
  })
  async generateMigration(
    @Option({
      name: 'name',
      alias: 'n',
      describe: 'Entity name',
      type: 'string',
      default: 'migration',
    })
    entityName: string,
  ) {
    const entityPath = path.resolve(__dirname, '..', '..');
    const entityFiles = this.findEntityFiles(entityPath);
    console.log(entityFiles);
    await execAsync('npm run build');
    await this.execute('migration:generate', entityName);
  }

  @Command({
    command: 'migration:run',
    describe: 'run migration',
  })
  async runMigration() {
    console.log('running migration...');
    await this.execute('migration:run');
  }

  private async execute(command: string, entityName?: string) {
    let base = `ts-node -r tsconfig-paths/register ./node_modules/.bin/typeorm ${command} `;

    switch (command) {
      case 'migration:generate':
        base += `src/database/migrations/${entityName} -d ./src/database/typeorm.ts`;
        break;
      case 'migration:create':
        base += `src/database/migrations/${entityName}`;
        break;
      case 'migration:run':
        base += '-d ./src/database/typeorm.ts';
        break;
      default:
        break;
    }

    try {
      const { stderr, stdout } = await execAsync(base);
      console.log(stdout);
      console.log(stderr);
    } catch (error) {
      console.error(error);
    }
  }

  private findEntityFiles(directory: string): string[] {
    const files = fs.readdirSync(directory);
    let entityFiles: string[] = [];

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        entityFiles = entityFiles.concat(this.findEntityFiles(filePath));
      } else if (file.endsWith('.entity.ts')) {
        entityFiles.push(filePath);
      }
    }

    return entityFiles;
  }
}
