import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService, // Usamos el mock del servicio
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 25,
        password: 112,
        email: 12421,
      };
      const createdUser = { id: 1, ...createUserDto };

      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(createdUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          firstName: 'John',
          lastName: 25,
          password: 112,
          email: 12421,
        },
      ];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = {
        firstName: 'John',
        lastName: 25,
        password: 112,
        email: 12421,
      };
      mockUserService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('1');
      expect(result).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith(1); // Verificamos que se llamó con el ID 1
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'John',
        lastName: 25,
        password: 112,
        email: 12421,
      };
      const updatedUser = { id: 1, ...updateUserDto };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove('1');
      expect(result).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
