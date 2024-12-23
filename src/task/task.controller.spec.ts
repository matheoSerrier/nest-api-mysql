import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AssignUsersDto } from './dto/assign-users.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    assignUsersToTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call TaskService.findAll and return all tasks', async () => {
      const mockTasks = [{ id: 1, title: 'Test Task' }];
      mockTaskService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('findById', () => {
    it('should call TaskService.findById and return the task', async () => {
      const mockTask = { id: 1, title: 'Test Task' };
      mockTaskService.findById.mockResolvedValue(mockTask);

      const result = await controller.findById(1);
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error if TaskService.findById throws an exception', async () => {
      mockTaskService.findById.mockRejectedValue(new Error('Task not found'));

      await expect(controller.findById(1)).rejects.toThrow('Task not found');
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('assignUsersToTask', () => {
    it('should call TaskService.assignUsersToTask and return the updated task', async () => {
      const mockTask = { id: 1, title: 'Test Task', assignedUsers: [{ id: 1 }] };
      const assignUsersDto: AssignUsersDto = { userIds: [1] };

      mockTaskService.assignUsersToTask.mockResolvedValue(mockTask);

      const result = await controller.assignUsersToTask(1, assignUsersDto);
      expect(service.assignUsersToTask).toHaveBeenCalledWith(1, assignUsersDto.userIds);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error if TaskService.assignUsersToTask throws an exception', async () => {
      const assignUsersDto: AssignUsersDto = { userIds: [1] };
      mockTaskService.assignUsersToTask.mockRejectedValue(new Error('Task not found'));

      await expect(controller.assignUsersToTask(1, assignUsersDto)).rejects.toThrow('Task not found');
      expect(service.assignUsersToTask).toHaveBeenCalledWith(1, assignUsersDto.userIds);
    });
  });
});
