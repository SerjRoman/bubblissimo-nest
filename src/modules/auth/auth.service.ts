import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedUserResponse, TokenResponse } from './auth.types';
import { LoginDto, MeDto, RefreshDto, RegisterUserDto } from './dto';
import { UserContractRepository } from '@modules/user/repository/user.repository.abstract';
import { TokenService } from './token.service';
import { UserCreateInput, UserWithSelect } from '@modules/user/user.types';
import { HashUtil } from '@common/utils';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly repository: UserContractRepository,
		private readonly tokenService: TokenService,
		private readonly hashUtil: HashUtil,
	) {}
	async registerUser(dto: RegisterUserDto): Promise<TokenResponse> {
		this.logger.log(`Attempting to register user with email: ${dto.email}`);

		let isExisting = false;
		try {
			await this.repository.get({
				where: { email: dto.email },
			});
		} catch (error) {
			if (error instanceof NotFoundException) {
				isExisting = false;
			} else {
				isExisting = true;
			}
		}

		if (isExisting) {
			this.logger.warn(
				'Registration failed: User with such email already exists',
			);
			throw new ConflictException('User with this email already exists');
		}
		this.logger.warn('Hashing password');
		const hashedPassword = await this.hashUtil.hash(dto.password);

		const prismaData: UserCreateInput = {
			...dto,
			password: hashedPassword,
			roles: [],
			studentProfile: dto.roles.includes('STUDENT')
				? { create: {} }
				: undefined,
			teacherProfile: dto.roles.includes('TEACHER')
				? { create: {} }
				: undefined,
		};
		this.logger.warn(`Creating user with such query: ${prismaData}`);

		const createdUser = await this.repository.create(prismaData);
		const user = await this.repository.getWithSelect({
			where: { id: createdUser.id },
			select: {
				teacherProfile: { select: { id: true } },
				studentProfile: { select: { id: true } },
				roles: true,
				id: true,
			},
		});

		const tokens = this.tokenService.generateTokens({
			userId: user.id,
			roles: user.roles,
			studentId: user.studentProfile?.id,
			teacherId: user.teacherProfile?.id,
		});
		this.logger.warn(`Tokens successfully granted: ${tokens}`);

		return tokens;
	}
	async login(dto: LoginDto): Promise<TokenResponse> {
		this.logger.warn(
			`Attemptin to log in the user with email: ${dto.email}`,
		);
		const { email, password } = dto;
		let user: UserWithSelect<{
			password: true;
			id: true;
			teacherProfile: { select: { id: true } };
			studentProfile: { select: { id: true } };
			roles: true;
		}> | null = null;
		try {
			user = await this.repository.getWithSelect({
				where: { email },
				select: {
					password: true,
					id: true,
					teacherProfile: { select: { id: true } },
					studentProfile: { select: { id: true } },
					roles: true,
				},
			});
		} catch (error) {
			if (!(error instanceof NotFoundException)) {
				this.logger.warn(
					`Login failed: user does not exist: ${dto.email}`,
				);
				throw error;
			}
		}
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isMatch = await this.hashUtil.compare(
			password,
			user.password as string,
		);
		if (!isMatch) {
			this.logger.warn(`Login failed: wrong password: ${dto.email}`);
			throw new UnauthorizedException('Invalid credentials');
		}

		const tokens = await this.tokenService.generateTokens({
			userId: user.id,
			roles: user.roles,
			teacherId: user.teacherProfile?.id,
			studentId: user.studentProfile?.id,
		});
		this.logger.warn(`Tokens successfully granted: ${tokens}`);

		return tokens;
	}
	async refresh(dto: RefreshDto): Promise<{ accessToken: string }> {
		const userDataFromToken = await this.tokenService.verifyRefreshToken(
			dto.refreshToken,
		);
		const newAccessToken =
			await this.tokenService.generateAccessToken(userDataFromToken);
		return { accessToken: newAccessToken };
	}
	async me(dto: MeDto): Promise<AuthenticatedUserResponse> {
		const userData = await this.repository.getWithSelect({
			where: { id: dto.userId },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				avatar: true,
				email: true,
				roles: true,
				username: true,
			},
		});
		return userData;
	}
	async logout(): Promise<void> {
		// TODO: Store refreshToken in cache and delete it from cache on logout
		return;
	}
}
