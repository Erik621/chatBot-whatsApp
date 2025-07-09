import { DataSource } from 'typeorm';
import {Intent} from './entities/nlpBot/Intent';
import {Example} from './entities/nlpBot/Example';
import {Answer} from './entities/nlpBot/Answer';
import {User} from './entities/interface/User';
import dotenv from "dotenv";
import { Categoria } from './entities/interface/Categoria';
import { Produto } from './entities/interface/Produto';
import { Ingrediente } from './entities/interface/Ingrediente';




export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_DATABASE || "meubanco",
  synchronize: false, // nunca deixe true em produção
  logging: false,
  entities: [Intent,Example,Answer,User,Categoria,Produto,Ingrediente], // ajuste para onde estão suas entidades
  migrations: ['db/migrations/*.ts'],
  subscribers: [],
});
