import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json(
        typeof res === 'object' ? res : { statusCode: status, message: res },
      );
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          const target = (exception.meta?.target as string[])?.join(', ') || 'campo';
          return response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message: `Já existe um registro cadastrado com este valor no campo (${target}).`,
            error: 'Conflict',
          });
        }
        case 'P2025': {
          return response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Registro não encontrado no banco de dados.',
            error: 'Not Found',
          });
        }
        default: {
          return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Erro de banco de dados (${exception.code}): ${exception.message}`,
            error: 'Bad Request',
          });
        }
      }
    }

    console.error('Unhandled error caught by exception filter:', exception);
    const errorMessage = exception instanceof Error ? exception.message : 'Erro interno do servidor.';
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      error: 'Internal Server Error',
    });
  }
}
