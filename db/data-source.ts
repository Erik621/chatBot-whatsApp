import { DataSource } from 'typeorm';
import {Intent} from './entities/Intent';
import {Example} from './entities/Example';
import {Answer} from './entities/Answer';
import dotenv from "dotenv";




export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_DATABASE || "meubanco",
  synchronize: false, // nunca deixe true em produção
  logging: false,
  entities: [Intent,Example,Answer], // ajuste para onde estão suas entidades
  migrations: ['db/migrations/*.ts'],
  subscribers: [],
});
