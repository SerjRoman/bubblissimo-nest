import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private logger = new Logger();
	catch(exception: unknown, host: ArgumentsHost) {
		this.logger.error(exception);
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let status: number = 500;
		let message: string = 'Internal Server Error';
		if (exception instanceof HttpException) {
			status = exception.getStatus();
			message = exception.message;
		} else if (exception instanceof TypeORMError) {
			if (exception instanceof EntityNotFoundError) {
				status = 404;
				message = exception.message;
			} else if (exception instanceof QueryFailedError) {
				message = exception.message;
			}
		}

		const responseBody = {
			statusCode: status,
			message: message,
			timestamp: new Date().toISOString(),
			path: request.url,
		};
		response.status(status).json(responseBody);
	}
}
