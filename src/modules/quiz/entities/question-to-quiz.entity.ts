import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from './quiz.entity';
import { Question } from '@modules/question/entities';

@Entity('question_to_quiz')
@Unique(['quiz', 'order'])
export class QuestionToQuiz {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ description: 'Order of the question in the quiz' })
	@Column({ type: 'int' })
	order: number;

	@ApiProperty({
		description: 'Time limit override for this specific quiz context',
		required: false,
	})
	@Column({ type: 'int', default: 30 })
	time: number;

	@ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
	quiz: Quiz;

	@ManyToOne(() => Question, (question) => question.quizzes, {
		onDelete: 'CASCADE',
	})
	question: Question;
}
