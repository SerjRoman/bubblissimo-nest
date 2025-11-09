import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@modules/user/user.module';
import { SharedUtilsModule } from '@common/utils';

@Module({
	controllers: [AuthController],
	imports: [
		UserModule,
		ConfigModule,
		JwtModule.register({}),
		SharedUtilsModule,
	],
	providers: [AuthService, TokenService],
	exports: [AuthService, TokenService],
})
export class AuthModule {}
