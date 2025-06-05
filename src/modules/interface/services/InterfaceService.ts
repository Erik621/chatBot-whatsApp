// src/modules/users/services/UserService.ts
import { UserRepository } from '../repositories/InterfaceRepository';
import { CreateUserDTO } from '../dtos/CreateInterfaceDTO';
import { User } from '../../../../db/entities/interface/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
  async register(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
    const existing = await UserRepository.findOneBy({ email: data.email });
    if (existing) {
      throw new Error('Email já cadastrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = UserRepository.create({ ...data, password: passwordHash });

    await UserRepository.save(user);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: CreateUserDTO): Promise<{ token: string }> {
    const user = await UserRepository.findOneBy({ email: data.email });
    if (!user) throw new Error('Credenciais inválidas');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Credenciais inválidas');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '1d',
    });

    return { token };
  }
}
