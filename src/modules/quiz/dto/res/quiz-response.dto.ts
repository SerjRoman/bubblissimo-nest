import { Expose, Type } from 'class-transformer';
import { QuizSummaryDto } from '../quiz-summary.dto';
import { Tag, Language, Subject } from '@modules/taxonomy/entities';
import { ApiProperty } from '@nestjs/swagger';
import { TeacherProfileSummaryDto, UserSummaryDto } from '@modules/user/dto';

export class QuizResponseDto extends QuizSummaryDto {
	@ApiProperty({ type: () => [Tag] })
	@Expose()
	tags: Tag[];

	@ApiProperty({ type: () => [Language] })
	@Expose()
	languages: Language[];

	@ApiProperty({ type: () => Subject, nullable: false })
	@Expose()
	subject: Subject;

	@ApiProperty()
	@Expose()
	favouritesCount: number;

	@ApiProperty({ type: UserSummaryDto, nullable: true })
	@Type(() => UserSummaryDto)
	@Expose()
	favouritedBy: UserSummaryDto;

	@ApiProperty()
	@Expose()
	copiesCount: number;

	@ApiProperty({ type: TeacherProfileSummaryDto, nullable: true })
	@Type(() => TeacherProfileSummaryDto)
	@Expose()
	copiedBy: TeacherProfileSummaryDto;

	@ApiProperty({ type: QuizSummaryDto, nullable: true })
	@Type(() => QuizSummaryDto)
	@Expose()
	originalQuiz?: QuizSummaryDto;
}
