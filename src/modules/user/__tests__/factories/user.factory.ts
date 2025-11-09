import { CreateUserDto } from '../../dto/create-user.dto';

export class UserFactory {
	static buildCreateDto(overrides?: Partial<CreateUserDto>): CreateUserDto {
		const defaultUser: CreateUserDto = {
			email: 'test@gmail.com',
			password: 'test_password',
			firstName: 'test-first-name',
			lastName: 'test-last-name',
			username: 'test-username',
			role: 'TEACHER',
		};

		return {
			...defaultUser,
			...overrides,
		};
	}
}
