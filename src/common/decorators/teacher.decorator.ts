import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException,
} from '@nestjs/common';
import { UserFromTokenPayload } from './user.decorator';

export const TeacherIdDecorator = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): string => {
		const request: { user: UserFromTokenPayload } = ctx
			.switchToHttp()
			.getRequest();
		const user = request.user;

		if (!user || !user.teacherId) {
			throw new InternalServerErrorException(
				'The TeacherId decorator cannot be used without a valid teacher context. Make sure TeacherGuard is protecting this route.',
			);
		}

		return user.teacherId;
	},
);
