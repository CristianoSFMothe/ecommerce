import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Ocorreu um erro';

    if (status === HttpStatus.UNAUTHORIZED) {
      message = 'Não autorizado';
    } else if (status === HttpStatus.FORBIDDEN) {
      message = 'Acesso proibido';
    } else if (status === HttpStatus.BAD_REQUEST) {
      message = 'Solicitação inválida';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
