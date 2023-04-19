import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionResponse } from './http-exception.interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    //const request = ctx.getRequest();
    const response = ctx.getResponse();

    let statusCode: number;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage =
        (errorResponse as HttpExceptionResponse).error || exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'INTERNAL SERVER ERROR HAPPENDED';
    }

    const httpExceptionResponse: HttpExceptionResponse = {
      status: statusCode,
      error: errorMessage,
    };

    response.status(statusCode).json(httpExceptionResponse);
  }
}
