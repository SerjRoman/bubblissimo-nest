import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException,
} from '@nestjs/common';
import { UserFromTokenPayload } from './user.decorator';

export const StudentIdDecorator = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): string => {
		const request: { user: UserFromTokenPayload } = ctx
			.switchToHttp()
			.getRequest();
		const user = request.user;

		if (!user || !user.studentId) {
			throw new InternalServerErrorException(
				'The StudentId decorator cannot be used without a valid student context. Make sure StudentGuard is protecting this route.',
			);
		}

		return user.studentId;
	},
);
