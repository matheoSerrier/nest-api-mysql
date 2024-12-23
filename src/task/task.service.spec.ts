import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;

  const mockTaskRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const mockTasks = [{ id: 1, title: 'Test Task', project: {}, assignedUsers: [] }];
      mockTaskRepository.find.mockResolvedValue(mockTasks);

      const result = await service.findAll();
      expect(taskRepository.find).toHaveBeenCalledWith({ relations: ['project', 'assignedUsers'] });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('findById', () => {
    it('should return a task if found', async () => {
      const mockTask = { id: 1, title: 'Test Task', project: {}, assignedUsers: [] };
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findById(1);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['project', 'assignedUsers'],
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['project', 'assignedUsers'],
      });
    });
  });

  describe('assignUsersToTask', () => {
    it('should assign users to a task', async () => {
      const mockTask = { id: 1, assignedUsers: [] };
      const mockUsers = [{ id: 1 }, { id: 2 }];

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockUserRepository.findByIds.mockResolvedValue(mockUsers);
      mockTaskRepository.save.mockResolvedValue({ ...mockTask, assignedUsers: mockUsers });

      const result = await service.assignUsersToTask(1, [1, 2]);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['assignedUsers'],
      });
      expect(userRepository.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(taskRepository.save).toHaveBeenCalledWith({
        ...mockTask,
        assignedUsers: mockUsers,
      });
      expect(result).toEqual({ ...mockTask, assignedUsers: mockUsers });
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.assignUsersToTask(1, [1, 2])).rejects.toThrow(NotFoundException);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['assignedUsers'],
      });
    });
  });
});
