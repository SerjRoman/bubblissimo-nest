import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SharedUtilsModule } from '@common/utils/shared-utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities';

@Module({
	controllers: [AuthController],
	imports: [
		ConfigModule,
		JwtModule.register({}),
		SharedUtilsModule,
		TypeOrmModule.forFeature([User]),
	],
	providers: [AuthService, TokenService],
	exports: [AuthService, TokenService],
})
export class AuthModule {}
