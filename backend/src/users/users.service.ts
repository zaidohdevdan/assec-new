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
    const updateData: Prisma.UserUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role as Role;
    if (data.status !== undefined) updateData.status = data.status as UserStatus;

    if (data.cpf !== undefined) {
      updateData.cpf = data.cpf === '' ? null : data.cpf;
    }
    if (data.rg !== undefined) {
      updateData.rg = data.rg === '' ? null : data.rg;
    }
    if (data.matricula !== undefined) {
      updateData.matricula = data.matricula === '' ? null : data.matricula;
    }
    if (data.org !== undefined) {
      updateData.org = data.org === '' ? null : data.org;
    }
    if (data.specialty !== undefined) {
      updateData.specialty = data.specialty === '' ? null : data.specialty;
    }
    if (data.photoUrl !== undefined) {
      updateData.photoUrl = data.photoUrl === '' ? null : data.photoUrl;
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl === '' ? null : data.avatarUrl;
    }

    if (data.password && typeof data.password === 'string' && data.password.trim().length > 0) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Check unique constraints before updating to provide a clean ConflictException
    if (updateData.email && typeof updateData.email === 'string') {
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

    if (updateData.cpf && typeof updateData.cpf === 'string') {
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

    if (updateData.matricula && typeof updateData.matricula === 'string') {
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
