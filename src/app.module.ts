import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthTokenModule } from '@auth/auth-token.module';
import { SharedUtilsModule } from '@common/utils/shared-utils.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		AuthTokenModule,
		UserModule,
		AuthModule,
		SharedUtilsModule,
	],
})
export class AppModule {}
