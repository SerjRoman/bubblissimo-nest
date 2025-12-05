import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserFromTokenPayload } from '@common/decorators';
import { Repository } from 'typeorm';
import { User } from '@modules/user/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
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
		const user = await this.userRepository.findOneOrFail({
			where: { id: payload.userId },
			relations: {
				studentProfile: true,
				teacherProfile: true,
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
