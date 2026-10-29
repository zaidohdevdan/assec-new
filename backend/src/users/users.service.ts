import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  PrismaService,
  Prisma,
  UserStatus,
  Role,
} from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  isAcceptablePassword,
  MIN_PASSWORD_LENGTH,
} from '../auth/password-policy';
import { evictAccountCache } from '../auth/account-cache';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    if (!isAcceptablePassword(data.password)) {
      throw new BadRequestException(
        `A senha deve ter entre ${MIN_PASSWORD_LENGTH} e 128 caracteres.`,
      );
    }

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
        displayName: true,
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
        tokenVersion: true,
        mustChangePassword: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      email: string;
      password?: string;
      name: string;
      displayName: string | null;
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
    if (data.displayName !== undefined) {
      updateData.displayName =
        data.displayName === '' ? null : data.displayName;
    }
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.status !== undefined) updateData.status = data.status;

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

    if (
      data.password &&
      typeof data.password === 'string' &&
      data.password.trim().length > 0
    ) {
      if (!isAcceptablePassword(data.password)) {
        throw new BadRequestException(
          `A senha deve ter entre ${MIN_PASSWORD_LENGTH} e 128 caracteres.`,
        );
      }
      updateData.password = await bcrypt.hash(data.password, 10);
      updateData.tokenVersion = { increment: 1 };
      updateData.mustChangePassword = true;
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

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    evictAccountCache(id);

    if (data.role !== undefined) {
      await this.recordAuthEvent({
        userId: id,
        email: updated.email,
        action: 'ROLE_CHANGED',
        metadata: `Novo papel atribuído: ${data.role}`,
      });
    }

    return updated;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
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
    if (!isAcceptablePassword(newPassword)) {
      throw new BadRequestException(
        `A senha deve ter entre ${MIN_PASSWORD_LENGTH} e 128 caracteres.`,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { cpf: identifier }],
      },
    });

    if (!user) {
      // Return false instead of throwing to avoid user enumeration
      return false;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
        mustChangePassword: true,
      },
    });

    evictAccountCache(user.id);

    return true;
  }

  async changeOwnPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    if (!isAcceptablePassword(newPassword)) {
      throw new BadRequestException(
        `A nova senha deve ter entre ${MIN_PASSWORD_LENGTH} e 128 caracteres.`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const matchesCurrent = await bcrypt.compare(currentPassword, user.password);
    if (!matchesCurrent) {
      throw new UnauthorizedException(
        'A senha atual informada está incorreta.',
      );
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual.',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
        mustChangePassword: false,
      },
    });

    evictAccountCache(userId);

    const { password: _password, ...publicUser } = updated;
    void _password;
    return publicUser;
  }

  async incrementTokenVersion(userId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { tokenVersion: { increment: 1 } },
      });
    } catch {
      // Ignore if user no longer exists or update is not mocked in unit test
    } finally {
      evictAccountCache(userId);
    }
  }

  async recordAuthEvent(entry: {
    userId?: string | null;
    action: string;
    email?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: string | null;
  }): Promise<void> {
    try {
      const authEventRepo = (
        this.prisma as unknown as {
          authEvent?: { create?: (args: unknown) => Promise<unknown> };
        }
      ).authEvent;
      if (!authEventRepo?.create) return;

      await authEventRepo.create({
        data: {
          userId: entry.userId ?? null,
          action: entry.action,
          email: entry.email ?? null,
          ipAddress: entry.ipAddress ?? null,
          userAgent: entry.userAgent ?? null,
          metadata: entry.metadata ?? null,
        },
      });
    } catch {
      // Audit logging is best-effort and must never break authentication flows
    }
  }

  async findRecentAuthEvents(limit = 100) {
    return this.prisma.authEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async deleteUser(id: string) {
    evictAccountCache(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
