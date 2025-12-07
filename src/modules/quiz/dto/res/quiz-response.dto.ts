import { Expose, Type } from 'class-transformer';
import { QuizSummaryDto } from '../quiz-summary.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TeacherProfileSummaryDto, UserSummaryDto } from '@modules/user/dto';
import { TaxonomySummaryDto } from '@modules/taxonomy/dto';

export class QuizResponseDto extends QuizSummaryDto {
	@ApiProperty({ type: () => [TaxonomySummaryDto] })
	@Type(() => TaxonomySummaryDto)
	@Expose()
	tags: TaxonomySummaryDto[];

	@ApiProperty({ type: () => [TaxonomySummaryDto] })
	@Type(() => TaxonomySummaryDto)
	@Expose()
	languages: TaxonomySummaryDto[];

	@ApiProperty({ type: () => TaxonomySummaryDto, nullable: false })
	@Type(() => TaxonomySummaryDto)
	@Expose()
	subject: TaxonomySummaryDto;

	@ApiProperty()
	@Expose()
	favouritesCount: number;

	@ApiProperty({ type: UserSummaryDto, nullable: true })
	@Type(() => UserSummaryDto)
	@Expose()
	favouritedBy: UserSummaryDto[];

	@ApiProperty()
	@Expose()
	copiesCount: number;

	@ApiProperty({ type: TeacherProfileSummaryDto, nullable: true })
	@Type(() => TeacherProfileSummaryDto)
	@Expose()
	copiedBy: TeacherProfileSummaryDto[];

	@ApiProperty({ type: QuizSummaryDto, nullable: true })
	@Type(() => QuizSummaryDto)
	@Expose()
	originalQuiz?: QuizSummaryDto;
}
