import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, QuizAccess, QuizFolder } from './entities';
import { QuestionToQuiz } from './entities/question-to-quiz.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { User } from '@modules/user/entities';
import { QuizAccessController } from './quiz-access.controller';
import { QuizAccessService } from './quiz-access.service';

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
	controllers: [QuizController, QuizAccessController],
	providers: [QuizService, QuizAccessService],
	exports: [QuizService, QuizAccessService],
})
export class QuizModule {}
