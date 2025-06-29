// src/modules/users/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/InterfaceService';

const userService = new UserService();

export class UserController {

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result = await userService.login(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }


}