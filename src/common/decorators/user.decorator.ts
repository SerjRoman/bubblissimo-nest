import { Role } from '@modules/user/enums';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserFromTokenPayload {
	userId: string;
	roles: Role[];
	teacherId?: string;
	studentId?: string;
}

export const UserDecorator = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): UserFromTokenPayload => {
		const request: { user: UserFromTokenPayload } = ctx
			.switchToHttp()
			.getRequest();
		return request.user;
	},
);
