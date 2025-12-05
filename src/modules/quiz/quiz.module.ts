import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, QuizAccess, QuizFolder } from './entities';
import { QuestionToQuiz } from './entities/question-to-quiz.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { User } from '@modules/user/entities';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Quiz,
			QuizAccess,
			QuestionToQuiz,
			QuizFolder,
			User,
		]),
	],
	controllers: [QuizController],
	providers: [QuizService],
	exports: [QuizService],
})
export class QuizModule {}
