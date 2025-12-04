import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, QuizAccess, QuizFolder } from './entities';
import { QuestionToQuiz } from './entities/question-to-quiz.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Quiz,
			QuizAccess,
			QuestionToQuiz,
			QuizFolder,
		]),
	],
})
export class QuizModule {}
