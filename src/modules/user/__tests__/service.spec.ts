import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserFactory } from './factories/user.factory';
import { HashUtil } from '@common/utils';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { EntityNotFoundError, Repository } from 'typeorm';
import { StudentProfile, TeacherProfile, User } from '../entities';

describe('UserService', () => {
	let service: UserService;
	let mockUserRepository: DeepMockProxy<Repository<User>>;
	let mockHashUtil: DeepMockProxy<HashUtil>;
	const mockUserInRepo = {
		...UserFactory.buildCreateDto(),
		id: 'user-1',
		roles: [],
		avatar: null,
		favouriteQuzzesIds: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(async () => {
		mockUserRepository = mockDeep<Repository<User>>();
		mockHashUtil = mockDeep<HashUtil>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: HashUtil,
					useValue: mockHashUtil,
				},
			],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a user and hash the password', async () => {
			const userCreateDto = UserFactory.buildCreateDto();

			mockUserRepository.create.mockResolvedValue;
			mockHashUtil.hash.mockResolvedValue(userCreateDto.password);

			const result = await service.create(userCreateDto);

			expect(result).toBeDefined();
			expect(result.id).toEqual('user-1');
			expect(result.email).toBe(userCreateDto.email);
		});
	});

	describe('getById', () => {
		it('should find and return a user by id', async () => {
			mockUserRepository.get.mockResolvedValue(mockUserInRepo);

			const foundUser = await service.getById(mockUserInRepo.id);

			expect(foundUser).toBeDefined();
			expect(foundUser.id).toBe(mockUserInRepo.id);
		});

		it('should throw NotFoundException if user does not exist', async () => {
			const notFoundError = new EntityNotFoundError(User, null);
			mockUserRepository.findOneOrFail.mockRejectedValue(notFoundError);

			await expect(service.getById('non-existent-id')).rejects.toThrow(
				notFoundError,
			);
		});
	});

	describe('delete', () => {
		it('should delete a user and then it should not be findable', async () => {
			const notFoundError = new EntityNotFoundError(User, null);
			mockUserRepository.findOneOrFail.mockRejectedValueOnce({});
			mockUserRepository.remove.mockResolvedValue({
				id: '',
				username: '',
				email: '',
				password: '',
				firstName: '',
				lastName: '',
				roles: [],
				avatar: null,
				favouriteQuizzes: [],
				notifications: [],
				createdAt: new Date(),
				updatedAt: new Date(),
				teacherProfile: new TeacherProfile(),
				studentProfile: new StudentProfile(),
			});
			mockUserRepository.findOneOrFail.mockRejectedValueOnce(
				notFoundError,
			);

			expect(await service.delete(mockUserInRepo.id)).toStrictEqual(
				mockUserInRepo,
			);

			await expect(service.getById(mockUserInRepo.id)).rejects.toThrow(
				notFoundError,
			);
		});
	});

	describe('getAll', () => {
		it('should get all users with pagination', async () => {
			const users = [mockUserInRepo, mockUserInRepo];
			const expectedPagination = {
				page: 1,
				perPage: 20,
				totalPages: 1,
				total: 2,
			};
			mockUserRepository.getAll.mockResolvedValue([
				users,
				expectedPagination,
			]);
			const usersWithPagination = await service.getAll({
				page: 1,
				perPage: 20,
			});
			expect(usersWithPagination[0]).toHaveLength(2);
			expect(usersWithPagination[1]).toStrictEqual(expectedPagination);
		});
	});
});
