import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { type AuthenticatedRequest } from './auth.types';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
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
