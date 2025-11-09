import { UserFromTokenPayload } from '@common/decorators/user.decorator';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { StringValue } from 'ms';
import { TokenResponse } from './auth.types';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async generateTokens(
		payload: UserFromTokenPayload,
	): Promise<TokenResponse> {
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		]);

		return { accessToken, refreshToken };
	}
	async generateAccessToken(payload: UserFromTokenPayload): Promise<string> {
		const accesssToken = await this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('ACCESS_SECRET_KEY'),
			expiresIn: this.configService.get<string>(
				'JWT_EXPIRES_IN',
			) as StringValue,
		});
		return accesssToken;
	}
	async generateRefreshToken(payload: UserFromTokenPayload): Promise<string> {
		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
			expiresIn: this.configService.get<string>(
				'REFRESH_JWT_EXPIRES_IN',
			) as StringValue,
		});
		return refreshToken;
	}

	async verifyAccessToken(
		accessToken: string,
	): Promise<UserFromTokenPayload> {
		try {
			return await this.jwtService.verifyAsync<UserFromTokenPayload>(
				accessToken,
				{
					secret: this.configService.get<string>('ACCESS_SECRET_KEY'),
				},
			);
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException('Access token expired');
			}
			throw new UnauthorizedException('Invalid access token');
		}
	}

	async verifyRefreshToken(token: string): Promise<UserFromTokenPayload> {
		try {
			return await this.jwtService.verifyAsync<UserFromTokenPayload>(
				token,
				{
					secret: this.configService.get<string>(
						'REFRESH_SECRET_KEY',
					),
				},
			);
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException('Refresh token expired');
			}
			throw new UnauthorizedException('Invalid refresh token');
		}
	}
}
