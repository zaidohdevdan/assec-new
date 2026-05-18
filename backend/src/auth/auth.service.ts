// backend/src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

// Interface para dados públicos (nunca exponha password)
export interface UserPublic {
  id: string;
  email: string;
  name: string;
  role: string;
  org: string;
  status: string;
  createdAt: string;
}

@Injectable() // ← Decorator obrigatório do NestJS
export class AuthService {
  // ← Classe, não objeto constante!
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserPublic | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) return null;

    if (user.status !== 'Ativo') {
      throw new UnauthorizedException(
        user.status === 'Pendente'
          ? 'Conta pendente de aprovação. Aguarde contato da ASSEC.'
          : 'Conta inativa.',
      );
    }

    return this.mapToPublic(user);
  }

  login(user: UserPublic) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    cpf?: string;
    org?: string;
    rg?: string;
    matricula?: string;
  }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name,
      cpf: data.cpf?.replace(/\D/g, ''),
      org: data.org || null,
      rg: data.rg || null,
      matricula: data.matricula || null,
      role: 'USER',
      status: 'Ativo',
    });

    return {
      message: 'Cadastro realizado com sucesso!',
      user: this.mapToPublic(user),
    };
  }

  private mapToPublic(user: User): UserPublic {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      org: user.org ?? 'Não informado',
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
