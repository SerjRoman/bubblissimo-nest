import { UserFromTokenPayload } from '@common/decorators';
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StudentGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const user: UserFromTokenPayload = request.user;

		if (!user || !user.studentId) {
			throw new ForbiddenException(
				'This resource is available only for students.',
			);
		}
		return true;
	}
}
