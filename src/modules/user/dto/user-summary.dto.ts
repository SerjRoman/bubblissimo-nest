import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UserSummaryDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	username: string;

	@ApiProperty()
	@Expose()
	firstName: string;

	@ApiProperty()
	@Expose()
	lastName: string;

	@ApiProperty({ nullable: true })
	@Expose()
	avatar: string | null;
}

export class TeacherProfileSummaryDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty({ type: UserSummaryDto })
	@Expose()
	@Type(() => UserSummaryDto)
	user: UserSummaryDto;
}
