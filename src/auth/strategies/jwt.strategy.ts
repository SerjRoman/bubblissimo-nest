import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserFromTokenPayload } from '../../common/decorators/user.decorator';
import { UserContractRepository } from '@modules/user/repository/user.repository.abstract';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly userRepository: UserContractRepository,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('ACCESS_SECRET_KEY'),
		});
	}

	async validate(
		payload: UserFromTokenPayload,
	): Promise<UserFromTokenPayload> {
		const user = await this.userRepository.getWithSelect({
			where: { id: payload.userId },
			select: {
				roles: true,
				studentProfile: { select: { id: true } },
				teacherProfile: { select: { id: true } },
			},
		});
		return {
			userId: payload.userId,
			roles: user.roles,
			studentId: user.studentProfile?.id,
			teacherId: user.teacherProfile?.id,
		};
	}
}
