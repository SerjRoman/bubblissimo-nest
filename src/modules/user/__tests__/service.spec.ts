import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserContractRepository } from '../repository/user.repository.abstract';
import { UserService } from '../user.service';
import { InMemoryUserRepository } from '../repository/user.repository.in-memory';
import { UserFactory } from './factories/user.factory';

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

    describe('findById', () => {
        it('should find and return a user by id', async () => {
            const userCreateDto = UserFactory.buildCreateDto();
            const createdUser = await service.create(userCreateDto);

            const foundUser = await service.findById(createdUser.id);

            expect(foundUser).toBeDefined();
            expect(foundUser.id).toBe(createdUser.id);
        });

        it('should throw NotFoundException if user does not exist', async () => {
            await expect(service.findById('non-existent-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('delete', () => {
        it('should delete a user and then it should not be findable', async () => {
            const userCreateDto = UserFactory.buildCreateDto();
            const createdUser = await service.create(userCreateDto);
            expect(await service.findById(createdUser.id)).toBeDefined();
            await service.delete(createdUser.id);
            await expect(service.findById(createdUser.id)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
