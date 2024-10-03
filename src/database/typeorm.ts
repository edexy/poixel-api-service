import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

const config = {
  type: 'sqlite',
  database: `${process.env.DATABASE_NAME}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
} satisfies DataSourceOptions;

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
