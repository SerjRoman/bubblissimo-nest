import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedUtilsModule } from '@common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfile, TeacherProfile, User } from './entities';

@Module({
	controllers: [UserController],
	imports: [
		SharedUtilsModule,
		TypeOrmModule.forFeature([User, TeacherProfile, StudentProfile]),
	],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
