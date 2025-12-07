import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthTokenModule } from '@auth/auth-token.module';
import { SharedUtilsModule } from '@common/utils/shared-utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxonomyModule } from '@modules/taxonomy/taxonomy.module';
import { QuizModule } from '@modules/quiz/quiz.module';
import { ReportModule } from '@modules/report/report.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { QuestionsModule } from '@modules/question/question.module';
import { ClassroomModule } from '@modules/classroom/classroom.module';
import { SessionModule } from '@modules/session/session.module';
import { QuizAccessModule } from '@modules/quiz-access/quiz-access.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('POSTGRES_HOST'),
				port: configService.get<number>('POSTGRES_PORT'),
				username: configService.get<string>('POSTGRES_USER'),
				password: configService.get<string>('POSTGRES_PASSWORD'),
				database: configService.get<string>('POSTGRES_DATABASE'),
				migrationsRun: true,
				autoLoadEntities: true,
				synchronize: true,
				// logging: true,
			}),
		}),

		ConfigModule.forRoot({ isGlobal: true }),
		AuthTokenModule,
		UserModule,
		AuthModule,
		SharedUtilsModule,
		TaxonomyModule,
		QuizModule,
		QuizAccessModule,
		ReportModule,
		NotificationModule,
		QuestionsModule,
		ClassroomModule,
		SessionModule,
	],
})
export class AppModule {}
