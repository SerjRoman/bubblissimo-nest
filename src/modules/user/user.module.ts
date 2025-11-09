import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { UserContractRepository } from './repository/user.repository.abstract';
import { SharedUtilsModule } from '@common/utils';

@Module({
	controllers: [UserController],
	imports: [SharedUtilsModule],
	providers: [
		UserRepository,
		{
			provide: UserContractRepository,
			useClass: UserRepository,
		},
		UserService,
	],
	exports: [UserService, UserRepository, UserContractRepository],
})
export class UserModule {}
