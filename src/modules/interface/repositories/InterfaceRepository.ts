// src/modules/users/repositories/UserRepository.ts
import { AppDataSource } from '../../../../db/data-source';
import { User } from '../../../../db/entities/interface/User';

export const UserRepository = AppDataSource.getRepository(User);
