import { Test, TestingModule } from '@nestjs/testing';
import {
	ConflictException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';
import { AuthFactory } from './factories/auth.factory';
import { UserFromTokenPayload } from '@common/decorators/user.decorator';
import { HashUtil } from '@common/utils';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserContractRepository } from '@modules/user/repository/user.repository.abstract';

jest.mock('../token.service');

describe('AuthService', () => {
	let service: AuthService;
	let mockRepository: DeepMockProxy<UserContractRepository>;
	let mockTokenService: DeepMockProxy<TokenService>;
	let mockHashUtil: DeepMockProxy<HashUtil>;

	beforeEach(async () => {
		mockTokenService = mockDeep<TokenService>();
		mockHashUtil = mockDeep<HashUtil>();
		mockRepository = mockDeep<UserContractRepository>();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UserContractRepository,
					useValue: mockRepository,
				},
				{
					provide: TokenService,
					useValue: mockTokenService,
				},
				{ provide: HashUtil, useValue: mockHashUtil },
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
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
			const notFoundError = new NotFoundException();
			const hashedPassword = 'hashed_password';
			const mockedTokens = {
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
			};
			const userInRepo = AuthFactory.buildRepositoryUser();

			mockHashUtil.hash.mockResolvedValue(hashedPassword);

			mockTokenService.generateTokens.mockResolvedValue(mockedTokens);

			mockRepository.get.mockRejectedValueOnce(notFoundError);
			mockRepository.get.mockResolvedValueOnce(userInRepo);
			mockRepository.create.mockResolvedValue(userInRepo);

			const result = await service.registerUser(registerUserDto);
			console.log(registerUserDto);
			expect(mockHashUtil.hash).toHaveBeenCalledWith(
				registerUserDto.password,
			);
			expect(mockTokenService.generateTokens).toHaveBeenCalledWith({
				userId: userInRepo.id,
				roles: userInRepo.roles,
			});

			expect(mockRepository.create).toHaveBeenCalledWith({
				data: {
					...registerUserDto,
					password: hashedPassword,
					teacherProfile: { create: {} },
					studentProfile: undefined,
				},
			});

			expect(result).toEqual(mockedTokens);
		});

		it('should throw ConflictException if user already exists', async () => {
			const userDto = AuthFactory.buildRegisterUserDto();
			const user = AuthFactory.buildRepositoryUser();

			mockRepository.get.mockResolvedValue(user);
			mockRepository.create.mockResolvedValue(user);

			await expect(
				service.registerUser({ ...userDto, email: user.email }),
			).rejects.toBeInstanceOf(ConflictException);
		});
	});

	describe('login', () => {
		it('should login a user and return tokens if credentials are correct', async () => {
			const baseUser = AuthFactory.buildRepositoryUser();
			const hashedPassword = `hashed_password`;

			const existingUser = {
				...baseUser,
				password: hashedPassword,
				studentProfile: { id: 'student_123' },
				teacherProfile: null,
			} as typeof baseUser & {
				studentProfile: { id: string };
				teacherProfile?: { id: string } | null;
			};
			mockRepository.get.mockResolvedValue(existingUser);

			const loginDto = {
				email: existingUser.email,
				password: 'password',
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
				studentId: existingUser.studentProfile.id,
				teacherId: existingUser.teacherProfile?.id,
				roles: existingUser.roles,
			});
			expect(result).toEqual(mockedTokens);
		});

		it('should throw UnauthorizedException if password is wrong', async () => {
			const user = AuthFactory.buildRepositoryUser();
			mockRepository.create.mockResolvedValue(user);

			const loginDto = AuthFactory.buildLoginDto({
				email: user.email,
			});

			await expect(service.login(loginDto)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(mockHashUtil.compare).not.toHaveBeenCalled();
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
			const user = AuthFactory.buildRepositoryUser();
			mockRepository.get.mockResolvedValue(user);
			const userPayload: UserFromTokenPayload = {
				userId: user.id,
				roles: user.roles,
				teacherId: 'test-teacher-id',
			};
			const userData = await service.me({ userId: userPayload.userId });

			expect(userData).toStrictEqual(user);
		});
		it('should throw NotFoundException if user not found by id', async () => {
			const notFoundError = new NotFoundException();
			const userPayload: UserFromTokenPayload = {
				userId: 'user-id',
				roles: ['TEACHER'],
				teacherId: 'test-teacher-id',
			};
			mockRepository.get.mockRejectedValue(notFoundError);

			await expect(
				service.me({ userId: userPayload.userId }),
			).rejects.toThrow(notFoundError);
		});
	});
});
