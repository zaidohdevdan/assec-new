import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  UseGuards,
  Request,
  Response,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { type AuthenticatedRequest } from './auth.types';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import * as crypto from 'crypto';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
  cpf: z.string().min(11).optional(),
  rg: z.string().optional(),
  matricula: z.string().optional(),
  org: z.string().optional(),
});

type LoginDto = z.infer<typeof loginSchema>;
type RegisterDto = z.infer<typeof registerSchema>;

const resetPasswordSchema = z.object({
  identifier: z.string(),
  newPassword: z.string().min(6),
});
type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

// Cookie name follows __Host- prefix convention for enhanced security
const SESSION_COOKIE = '__Host-assec_session';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // Distinguish blocked accounts (password correct but account inactive)
    if ((user as unknown as string) === 'BLOCKED') {
      throw new UnauthorizedException(
        'Conta suspensa ou inativa. Entre em contato com o administrador.',
      );
    }

    const { access_token, user: userPublic } = this.authService.login(user);

    // Set the JWT in a secure, HttpOnly cookie (not accessible via JavaScript)
    // This is the primary defence against XSS token theft
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(SESSION_COOKIE, access_token, {
      httpOnly: true,          // Not accessible via document.cookie (XSS protection)
      sameSite: 'lax',         // CSRF mitigation for same-site navigations
      secure: isProduction,    // HTTPS-only in production; allow HTTP in dev
      // __Host- prefix requires no Domain attribute
      path: '/',
      maxAge: 60 * 60 * 1000, // 1 hour, matching JWT_EXPIRES_IN
    });

    // Return public user data + access_token (for backward-compat with terminal root)
    // NOTE: access_token in body is kept for the Root Terminal which uses Bearer auth
    // TODO(security): Remove access_token from response body once terminal migrates to cookie auth
    return {
      access_token,
      user: {
        id: userPublic.id,
        name: userPublic.name,
        email: userPublic.email,
        role: userPublic.role,
        status: userPublic.status,
        photoUrl: (userPublic as any).photoUrl ?? null,
        specialty: (userPublic as any).specialty ?? null,
        org: (userPublic as any).org ?? null,
        matricula: (userPublic as any).matricula ?? null,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Response({ passthrough: true }) res: ExpressResponse) {
    // Clear the session cookie — browser will delete it immediately
    res.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return { success: true, message: 'Sessão encerrada com sucesso.' };
  }

  /**
   * Generates a CSRF token for use in state-changing requests.
   * Clients should send this token as the X-CSRF-Token header.
   * TODO(security): Implement full double-submit cookie CSRF validation per request.
   */
  @Get('csrf')
  getCsrfToken(@Response({ passthrough: true }) res: ExpressResponse) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    // Set as non-HttpOnly so JS can read it (this is the correct CSRF pattern)
    res.cookie('assec_csrf', csrfToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });
    return { csrfToken };
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('reset-password')
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const success = await this.usersService.updatePassword(
      resetPasswordDto.identifier,
      resetPasswordDto.newPassword,
    );
    if (!success) {
      throw new UnauthorizedException('User not found');
    }
    return { success: true, message: 'Password updated successfully' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.sub);
  }
}
