import { DataSource } from 'typeorm';
import {User} from './entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db', // nome do serviço no docker-compose
  port: 5432,
  username: 'admin',
  password: 'admin123',
  database: 'meubanco',
  synchronize: true, // true para dev (gera tabelas automaticamente)
  logging: false,
  entities: [User], // ajuste para onde estão suas entidades
  migrations: ['../db/migrations/*.ts'],
  subscribers: [],
});
