import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '@modules/user/user.module';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('SECRET_KEY'),
				signOptions: { expiresIn: '60m' },
			}),
			inject: [ConfigService],
		}),
	],
	providers: [JwtStrategy],
	exports: [PassportModule, JwtModule],
})
export class AuthTokenModule {}
