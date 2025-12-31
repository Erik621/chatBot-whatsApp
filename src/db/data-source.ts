import { DataSource } from 'typeorm';
import {Intent} from './entities/nlpBot/Intent';
import {Example} from './entities/nlpBot/Example';
import {Answer} from './entities/nlpBot/Answer';
import {User} from './entities/interface/User';
import dotenv from "dotenv";
import { Categoria } from './entities/interface/Categoria';
import { Produto } from './entities/interface/Produto';
import { Ingrediente } from './entities/interface/Ingrediente';
import { Cliente } from './entities/interface/pedido/Cliente';
import { Pagamento } from './entities/interface/pedido/Pagamento';
import { Pedido } from './entities/interface/pedido/Pedido';
import { PedidoIngrediente } from './entities/interface/pedido/PedidoIngrediente';
import { PedidoItem } from './entities/interface/pedido/PedidoItem';
import { WhatsappContato } from './entities/interface/WhatsappContato';
import path from 'path';




export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "admin",
  password: process.env.DB_PASSWORD || "A#1N6k9Z!94oMzoqXvfd",
  database: process.env.DB_DATABASE || "meubanco",
  synchronize: false,
  logging: false,
  entities: [
    // Ajusta dependendo do ambiente
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, 'entities/**/*.js') // produção usa JS gerado pelo tsc
      : path.join(__dirname, 'entities/**/*.ts') // dev usa TS
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, 'migrations/**/*.js')
      : path.join(__dirname, 'migrations/**/*.ts')
  ],
  subscribers: [],
});
