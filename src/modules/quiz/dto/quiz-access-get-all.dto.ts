import { CreatePaginatedResponseDto, PaginationDto } from '@common/dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { QuizAccess } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { stringToBoolean } from '@common/utils';

export class QuizAccessGetAllQueryDto extends PaginationDto {
	@ApiProperty({
		type: 'boolean',
		description: 'Query parameter to include the relation with the teacher',
		default: false,
		required: false,
	})
	@IsOptional() //db480c23-8a6d-47d9-a573-95f3216e44db
	@Transform(({ value }) => stringToBoolean(value))
	@IsBoolean()
	withTeacherProfile: boolean = false;

	@ApiProperty({
		type: 'boolean',
		description: `Query parameter to include teacher's relation with user`,
		default: false,
		required: false,
	})
	@IsOptional()
	@Transform(({ value }) => stringToBoolean(value))
	@IsBoolean()
	withUserProfile: boolean = false;

	@ApiProperty({
		type: 'boolean',
		description: 'Query parameter to include the relation with the quiz',
		default: false,
		required: false,
	})
	@IsOptional()
	@Transform(({ value }) => stringToBoolean(value))
	@IsBoolean()
	withQuiz: boolean = false;
}
export class PaginatedQuizAccessResponse extends CreatePaginatedResponseDto(
	QuizAccess,
) {}
