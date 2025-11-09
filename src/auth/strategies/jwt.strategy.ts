import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserContractRepository } from '@modules/user/repository/user.repository.abstract';
import { UserFromTokenPayload } from '@common/decorators';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly userRepository: UserContractRepository,
	) {
		const secretKey = configService.get<string>('ACCESS_SECRET_KEY');
		if (!secretKey) {
			throw new Error('ACCESS_SECRET_KEY is not defined');
		}
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secretKey,
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
