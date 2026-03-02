import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  username: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DB || 'mini_job_db',
  synchronize: false,
  logging: true,
  entities: [join(__dirname, '/**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '/migration/**/*.{ts,js}')],
  subscribers: [],
});
