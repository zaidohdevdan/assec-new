import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

// Hash used to burn the same CPU time when the e-mail does not exist, so the
// response time does not reveal which accounts are registered.
// Computed once at module load (cost factor matches UsersService).
const TIMING_EQUALIZER_HASH = bcrypt.hashSync(
  'timing-equalizer-not-a-password',
  10,
);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates credentials in (approximately) constant time and returns the
   * public user, or null for ANY failure (unknown e-mail, wrong password or
   * suspended account). Callers must not distinguish these cases to the client.
   */
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);

    // Always run bcrypt, even when the user does not exist.
    const passwordMatch = await bcrypt.compare(
      pass,
      user?.password ?? TIMING_EQUALIZER_HASH,
    );

    if (!user || !passwordMatch) return null;

    // Suspended/inactive accounts cannot log in. Same outcome as a wrong
    // password so the response never confirms that the password was correct.
    if (user.status !== 'Ativo') return null;

    const result: Partial<User> = { ...user };
    delete result.password;
    return result as Omit<User, 'password'>;
  }

  login(user: Omit<User, 'password'>) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      tokenVersion: (user as { tokenVersion?: number }).tokenVersion ?? 0,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  /**
   * Decodes a session token on logout and increments the user's tokenVersion
   * in the database so that the JWT is immediately revoked server-side even
   * before its 1-hour expiry.
   */
  async revokeTokenIfPresent(token?: string): Promise<string | null> {
    if (!token) return null;
    try {
      const payload = this.jwtService.verify<{ sub?: string }>(token, {
        algorithms: ['HS256'],
      });
      if (payload?.sub) {
        await this.usersService.incrementTokenVersion(payload.sub);
        return payload.sub;
      }
    } catch {
      // Token already expired or invalid — nothing to revoke
    }
    return null;
  }
}
