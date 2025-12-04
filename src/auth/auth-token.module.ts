import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { StringValue } from 'ms';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('SECRET_KEY'),
				signOptions: {
					expiresIn: configService.get<string>(
						'JWT_EXPIRES_IN',
					) as StringValue,
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [JwtStrategy],
	exports: [PassportModule, JwtModule],
})
export class AuthTokenModule {}
