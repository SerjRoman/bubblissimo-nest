import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@modules/user/user.module';

@Module({
	controllers: [AuthController],
	imports: [UserModule, ConfigModule, JwtModule.register({})],
	providers: [AuthService, TokenService],
	exports: [AuthService, TokenService],
})
export class AuthModule {}
