// src/modules/users/repositories/UserRepository.ts
import { AppDataSource } from '../../../../db/data-source';
import { User } from '../../../../db/entities/interface/User';
import { Categoria } from '../../../../db/entities/interface/Categoria';
import { Produto } from '../../../../db/entities/interface/Produto';

export const UserRepository = AppDataSource.getRepository(User);
export const CategoriaRepository = AppDataSource.getRepository(Categoria);
export const ProdutoRepository = AppDataSource.getRepository(Produto);
