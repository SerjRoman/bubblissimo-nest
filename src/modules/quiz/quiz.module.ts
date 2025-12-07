import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, QuizAccess, QuizFolder } from './entities';
import { QuestionToQuiz } from '../question/entities/question-to-quiz.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { TeacherProfile, User } from '@modules/user/entities';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Quiz,
			QuizAccess,
			QuestionToQuiz,
			QuizFolder,
			TeacherProfile,
			User,
		]),
	],
	controllers: [QuizController],
	providers: [QuizService],
	exports: [QuizService],
})
export class QuizModule {}
