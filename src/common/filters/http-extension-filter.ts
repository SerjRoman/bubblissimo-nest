import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private logger = new Logger();
	catch(exception: unknown, host: ArgumentsHost) {
		this.logger.error(exception);
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;
		const message =
			exception instanceof HttpException
				? exception.message
				: 'Internal server error';

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			message: message,
		});
	}
}
