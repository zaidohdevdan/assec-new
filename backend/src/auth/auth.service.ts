import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) return null;

    // Feature: Block login for suspended/inactive accounts
    if (user.status !== 'Ativo') {
      // Return a special sentinel value to distinguish from wrong-password
      return 'BLOCKED' as unknown as Omit<User, 'password'>;
    }

    const result: Partial<User> = { ...user };
    delete result.password;
    return result as Omit<User, 'password'>;
  }

  login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: Prisma.UserCreateInput) {
    const user = await this.usersService.create(data);
    const result: Partial<User> = { ...user };
    delete result.password;
    return this.login(result as Omit<User, 'password'>);
  }
}
