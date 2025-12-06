import { stringToBoolean } from '@common/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class QuizQueryDto {
	@ApiProperty({
		type: 'boolean',
		description:
			'Query parameter to include the relation with the original quiz',
		default: false,
		required: false,
	})
	@IsOptional()
	@Transform(({ value }) => stringToBoolean(value))
	@IsBoolean()
	withOriginalQuiz: boolean = false;
}
