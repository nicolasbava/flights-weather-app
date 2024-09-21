import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Mock del repositorio para evitar interacciones reales con la base de datos
const mockUserRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(), // Usamos el mock del repositorio
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { name: 'John', age: 25 };
      const savedUser = { id: 1, ...createUserDto };

      (repository.save as jest.Mock).mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(savedUser);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, name: 'John', age: 25 }];

      (repository.find as jest.Mock).mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { id: 1, name: 'John', age: 25 };

      (repository.findOneBy as jest.Mock).mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if user is not found', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(99);
      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 99 });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Jane', age: 26 };

      (repository.update as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual({ affected: 1 });
      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
