import { Test, TestingModule } from '@nestjs/testing';
import {
	ConflictException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';
import { AuthFactory } from './factories/auth.factory';
import { InMemoryUserRepository } from '../../user/repository/user.repository.in-memory';
import { UserContractRepository } from '../../user/repository/user.repository.abstract';
import { UserFromTokenPayload } from '@common/decorators/user.decorator';
import { HashUtil } from '@common/utils';

jest.mock('../token.service');
const mockTokenService = {
	generateTokens: jest.fn(),
	hashPassword: jest.fn(),
	comparePasswords: jest.fn(),
	verifyAccessToken: jest.fn(),
	verifyRefreshToken: jest.fn(),
	generateAccessToken: jest.fn(),
	generateRefreshToken: jest.fn(),
} as unknown as jest.Mocked<TokenService>;

const mockHashUtil = {
	hash: jest.fn(),
	compare: jest.fn(),
};
describe('AuthService', () => {
	let service: AuthService;
	let repository: InMemoryUserRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UserContractRepository,
					useClass: InMemoryUserRepository,
				},
				{
					provide: TokenService,
					useValue: mockTokenService,
				},
				{ provide: HashUtil, useValue: mockHashUtil },
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		repository = module.get<UserContractRepository>(
			UserContractRepository,
		) as InMemoryUserRepository;

		repository.clear();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('registerUser (Teacher) ', () => {
		it('should correctly call dependencies and return tokens', async () => {
			const registerUserDto = AuthFactory.buildRegisterUserDto({
				roles: ['TEACHER'],
			});
			const hashedPassword = 'hashed_password';
			const mockedTokens = {
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
			};
			mockHashUtil.hash.mockResolvedValue(hashedPassword);
			mockTokenService.generateTokens.mockResolvedValue(mockedTokens);
			const result = await service.registerUser(registerUserDto);
			const createdUser = await repository.getWithSelect({
				where: { email: registerUserDto.email },
				select: {
					password: true,
					id: true,
					roles: true,
				},
			});

			expect(mockHashUtil.hash).toHaveBeenCalledWith(
				registerUserDto.password,
			);
			expect(mockTokenService.generateTokens).toHaveBeenCalledWith({
				userId: createdUser.id,
				roles: createdUser.roles,
			});

			expect(createdUser.password).toBe(hashedPassword);

			expect(result).toEqual(mockedTokens);
		});

		it('should throw ConflictException if user already exists', async () => {
			const userDto = AuthFactory.buildRegisterUserDto();
			await repository.create(userDto);

			await expect(service.registerUser(userDto)).rejects.toThrow(
				ConflictException,
			);
		});
	});

	describe('login', () => {
		it('should login a user and return tokens if credentials are correct', async () => {
			const userDto = AuthFactory.buildRegisterUserDto();
			const hashedPassword = `hashed_${userDto.password}`;
			await repository.create({
				...userDto,
				password: hashedPassword,
			});
			const existingUser = await repository.getWithSelect({
				where: { email: userDto.email },
				select: {
					password: true,
					id: true,
					teacherProfile: { select: { id: true } },
					studentProfile: { select: { id: true } },
					roles: true,
				},
			});

			const loginDto = {
				email: userDto.email,
				password: userDto.password,
			};
			const mockedTokens = {
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
			};

			mockHashUtil.compare.mockResolvedValue(true);
			mockTokenService.generateTokens.mockResolvedValue(mockedTokens);

			const result = await service.login(loginDto);

			expect(mockHashUtil.compare).toHaveBeenCalledWith(
				loginDto.password,
				existingUser.password,
			);
			expect(mockTokenService.generateTokens).toHaveBeenCalledWith({
				userId: existingUser.id,
				studentId: existingUser.studentProfile?.id,
				teacherId: existingUser.studentProfile?.id,
				roles: existingUser.roles,
			});
			expect(result).toEqual(mockedTokens);
		});

		it('should throw UnauthorizedException if password is wrong', async () => {
			const userDto = AuthFactory.buildRegisterUserDto();
			await repository.create(userDto);

			const loginDto = AuthFactory.buildLoginDto({
				email: userDto.email,
			});

			mockHashUtil.compare.mockResolvedValue(false);

			await expect(service.login(loginDto)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(mockTokenService.generateTokens).not.toHaveBeenCalled();
		});

		it('should throw UnauthorizedException for a non-existent user', async () => {
			const loginDto = AuthFactory.buildLoginDto();

			await expect(service.login(loginDto)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(mockHashUtil.compare).not.toHaveBeenCalled();
			expect(mockTokenService.generateTokens).not.toHaveBeenCalled();
		});
	});
	it('should verify refresh token and return new access token', async () => {
		const userPayload: UserFromTokenPayload = {
			userId: 'user-id',
			roles: ['TEACHER'],
			teacherId: 'teacher-id',
		};
		const mockedTokens = {
			refreshToken: 'refresh_token',
			accessToken: 'access-token',
		};
		mockTokenService.verifyRefreshToken.mockResolvedValue(userPayload);
		mockTokenService.generateAccessToken.mockResolvedValue(
			mockedTokens.accessToken,
		);

		const accessToken = await service.refresh(mockedTokens);

		expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(
			mockedTokens.refreshToken,
		);
		expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(
			userPayload,
		);
		expect(accessToken).toEqual({ accessToken: mockedTokens.accessToken });
	});
	it('should throw UnauthorizedException if refresh token is expired', async () => {
		const mockedTokens = {
			refreshToken: 'refresh-token',
		};
		const unauthError = new UnauthorizedException('Refresh token expired');
		mockTokenService.verifyRefreshToken.mockRejectedValue(unauthError);

		await expect(service.refresh(mockedTokens)).rejects.toThrow(
			unauthError,
		);
		expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
	});
	describe('me', () => {
		it('should return user data by access token', async () => {
			const userRegisterDto = AuthFactory.buildRegisterUserDto();
			const createdUser = await repository.create(userRegisterDto);
			const userPayload: UserFromTokenPayload = {
				userId: createdUser.id,
				roles: createdUser.roles,
				teacherId: 'test-teacher-id',
			};
			const userData = await service.me({ userId: userPayload.userId });

			expect(userData).toStrictEqual(createdUser);
		});
		it('should throw NotFoundException if user not found by id', async () => {
			const userPayload: UserFromTokenPayload = {
				userId: 'user-id',
				roles: ['TEACHER'],
				teacherId: 'test-teacher-id',
			};

			await expect(
				service.me({ userId: userPayload.userId }),
			).rejects.toThrow(NotFoundException);
		});
	});
});
