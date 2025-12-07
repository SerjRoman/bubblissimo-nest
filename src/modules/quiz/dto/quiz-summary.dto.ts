import { TeacherProfileSummaryDto, UserSummaryDto } from '@modules/user/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { QuizVisibility } from '../enums';
import { Tag, Language, Subject } from '@modules/taxonomy/entities';

export class QuizSummaryDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	title: string;

	@ApiProperty()
	@Expose()
	status: string;

	@ApiProperty({ required: false, nullable: true })
	@Expose()
	coverImage: string;

	@ApiProperty({ type: TeacherProfileSummaryDto, required: false })
	@Type(() => TeacherProfileSummaryDto)
	@Expose()
	owner?: TeacherProfileSummaryDto;

	@ApiProperty()
	@Expose()
	isFavourite: boolean;
}

export class QuizDetailDto extends QuizSummaryDto {
	@ApiProperty({ enum: QuizVisibility })
	@Expose()
	visibility: QuizVisibility;

	@ApiProperty()
	@Expose()
	shuffleAnswers: boolean;

	@ApiProperty()
	@Expose()
	shuffleQuestions: boolean;

	@ApiProperty({ type: () => [Tag] })
	@Expose()
	tags: Tag[];

	@ApiProperty({ type: () => [Language] })
	@Expose()
	languages: Language[];

	@ApiProperty({ type: () => Subject, nullable: false })
	@Expose()
	subject: Subject;

	@ApiProperty({ type: TeacherProfileSummaryDto })
	@Type(() => TeacherProfileSummaryDto)
	@Expose()
	creator: TeacherProfileSummaryDto;

	@ApiProperty({ type: UserSummaryDto })
	@Type(() => UserSummaryDto)
	@Expose()
	favouritedBy: UserSummaryDto[];

	@ApiProperty({ type: UserSummaryDto })
	@Type(() => UserSummaryDto)
	@Expose()
	savedBy: UserSummaryDto[];

	@ApiProperty({ type: QuizSummaryDto })
	@Type(() => QuizSummaryDto)
	@Expose()
	originalQuiz: QuizSummaryDto;
}
