import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	BadRequestException,
	ValidationError,
	ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-extension-filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				console.log(validationErrors);
				return new BadRequestException(
					validationErrors.map((error) => ({
						field: error.property,
						error: error.constraints
							? Object.values(error.constraints).join(', ')
							: '',
					})),
				);
			},
		}),
	);

	app.useGlobalFilters(new HttpExceptionFilter());

	const config = new DocumentBuilder()
		.setTitle('Quiz App API')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);

	await app.listen(Number(process.env.PORT));
}
void bootstrap();
