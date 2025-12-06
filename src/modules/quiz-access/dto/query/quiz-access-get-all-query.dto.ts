import { PaginationDto } from '@common/dto';
import { stringToBoolean } from '@common/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class QuizAccessGetAllQueryDto extends PaginationDto {
	@ApiProperty({
		type: 'boolean',
		description: 'Query parameter to include the relation with the teacher',
		default: false,
		required: false,
	})
	@IsOptional()
	@Transform(({ value }) => stringToBoolean(value))
	@IsBoolean()
	withTeacherProfile: boolean = false;
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
