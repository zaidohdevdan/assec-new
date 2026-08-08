import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService, Prisma, UserStatus, Role } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput) {
    const sanitizedData = { ...data };
    if (sanitizedData.cpf === '') {
      sanitizedData.cpf = null;
    }
    if (sanitizedData.matricula === '') {
      sanitizedData.matricula = null;
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: sanitizedData.email },
          ...(sanitizedData.cpf ? [{ cpf: sanitizedData.cpf }] : []),
        ],
      },
    });

    if (existing) {
      throw new ConflictException('User with this email or CPF already exists');
    }

    const hashedPassword = await bcrypt.hash(sanitizedData.password, 10);

    return this.prisma.user.create({
      data: {
        ...sanitizedData,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        cpf: true,
        rg: true,
        matricula: true,
        status: true,
        org: true,
        since: true,
        photoUrl: true,
        avatarUrl: true,
        specialty: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      email: string;
      password?: string;
      name: string;
      role: Role;
      cpf: string | null;
      rg: string | null;
      matricula: string | null;
      status: UserStatus;
      org: string | null;
      photoUrl: string | null;
      avatarUrl: string | null;
      specialty: string | null;
    }>,
  ) {
    const updateData = { ...data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.cpf === '') {
      updateData.cpf = null;
    }
    if (updateData.matricula === '') {
      updateData.matricula = null;
    }

    // Check unique constraints before updating to provide a clean ConflictException
    if (updateData.email) {
      const emailConflict = await this.prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id },
        },
      });
      if (emailConflict) {
        throw new ConflictException('O e-mail informado já está em uso.');
      }
    }

    if (updateData.cpf) {
      const cpfConflict = await this.prisma.user.findFirst({
        where: {
          cpf: updateData.cpf,
          NOT: { id },
        },
      });
      if (cpfConflict) {
        throw new ConflictException('O CPF informado já está cadastrado.');
      }
    }

    if (updateData.matricula) {
      const matriculaConflict = await this.prisma.user.findFirst({
        where: {
          matricula: updateData.matricula,
          NOT: { id },
        },
      });
      if (matriculaConflict) {
        throw new ConflictException(
          'A matrícula informada já está cadastrada.',
        );
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        cpf: true,
        rg: true,
        matricula: true,
        org: true,
        specialty: true,
        photoUrl: true,
        avatarUrl: true,
        createdAt: true,
        since: true,
      },
    });
  }

  async updatePassword(identifier: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { cpf: identifier }],
      },
    });

    if (!user) {
      // Return false instead of throwing to avoid user enumeration, or throw NotFoundException
      return false;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return true;
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
