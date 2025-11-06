import { RegisterUserDto, LoginDto, MeDto, RefreshDto } from '../../dto/';
export class AuthFactory {
	static buildRegisterUserDto(
		overrides?: Partial<RegisterUserDto>,
	): RegisterUserDto {
		const defaultUserDto: RegisterUserDto = {
			email: 'test@gmail.com',
			username: 'test-username',
			password: 'test-password',
			firstName: 'test-first-name',
			lastName: 'test-last-name',
			roles: [],
		};
		return { ...defaultUserDto, ...overrides };
	}
	static buildLoginDto(overrides?: Partial<LoginDto>) {
		const defaultLoginDto: LoginDto = {
			email: 'test@gmail.com',
			password: 'test-password',
		};
		return { ...defaultLoginDto, ...overrides };
	}
	static buildRefreshDto(overrides?: Partial<RefreshDto>): RefreshDto {
		const defaultRefreshDto: RefreshDto = {
			refreshToken: 'refresh-token',
		};
		return { ...defaultRefreshDto, ...overrides };
	}
	static buildMeDto(overrides?: Partial<MeDto>): MeDto {
		const defaultMeDto: MeDto = {
			userId: 'user-id',
		};
		return { ...defaultMeDto, ...overrides };
	}
}
