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
		const request = ctx.getRequest<Request>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const errorResponse =
			exception instanceof HttpException
				? exception.getResponse()
				: {
						statusCode: status,
						message: 'Internal Server Error',
						error: 'Internal Server Error',
					};
		const responseBody =
			typeof errorResponse === 'object'
				? {
						...errorResponse,
						timestamp: new Date().toISOString(),
						path: request.url,
					}
				: {
						statusCode: status,
						message: errorResponse,
						timestamp: new Date().toISOString(),
						path: request.url,
					};
		response.status(status).json(responseBody);
	}
}
