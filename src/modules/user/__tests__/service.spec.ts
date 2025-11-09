import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserContractRepository } from '../repository/user.repository.abstract';
import { UserService } from '../user.service';
import { InMemoryUserRepository } from '../repository/user.repository.in-memory';
import { UserFactory } from './factories/user.factory';
import { HashUtil } from '@common/utils';
const mockHashUtil = {
	hash: jest.fn(),
	compare: jest.fn(),
};
describe('UserService', () => {
	let service: UserService;
	let repository: InMemoryUserRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: UserContractRepository,
					useClass: InMemoryUserRepository,
				},
				{
					provide: HashUtil,
					useValue: mockHashUtil,
				},
			],
		}).compile();

		service = module.get<UserService>(UserService);
		repository = module.get<UserContractRepository>(
			UserContractRepository,
		) as InMemoryUserRepository;

		repository.clear();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a user and hash the password', async () => {
			const userCreateDto = UserFactory.buildCreateDto();
			const result = await service.create(userCreateDto);

			expect(result).toBeDefined();
			expect(result.id).toEqual('user-1');
			expect(result.email).toBe(userCreateDto.email);
		});
	});

	describe('getById', () => {
		it('should find and return a user by id', async () => {
			const userCreateDto = UserFactory.buildCreateDto();
			const createdUser = await service.create(userCreateDto);

			const foundUser = await service.getById(createdUser.id);

			expect(foundUser).toBeDefined();
			expect(foundUser.id).toBe(createdUser.id);
		});

		it('should throw NotFoundException if user does not exist', async () => {
			await expect(service.getById('non-existent-id')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('delete', () => {
		it('should delete a user and then it should not be findable', async () => {
			const userCreateDto = UserFactory.buildCreateDto();
			const createdUser = await service.create(userCreateDto);
			expect(await service.getById(createdUser.id)).toBeDefined();
			await service.delete(createdUser.id);
			await expect(service.getById(createdUser.id)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('getAll', () => {
		it('should get all users with pagination', async () => {
			const userCreateDto1 = UserFactory.buildCreateDto();
			const userCreateDto2 = UserFactory.buildCreateDto({
				email: 'test2@gmail.com',
			});
			await service.create(userCreateDto1);
			await service.create(userCreateDto2);
			const expectedPagination = {
				page: 1,
				perPage: 20,
				pageCount: 1,
				total: 2,
			};
			const usersWithPagination = await service.getAll({
				page: 1,
				perPage: 20,
			});
			expect(usersWithPagination[0]).toHaveLength(2);
			expect(usersWithPagination[1]).toStrictEqual(expectedPagination);
		});
	});
});
