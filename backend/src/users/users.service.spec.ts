import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { UserService } from './users.service';
import { Verification } from './entities/Verification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerficationEmail: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepo: MockRepository;
  let verRepo: MockRepository;
  let mailService: MailService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    mailService = module.get<MailService>(MailService);
    userRepo = module.get(getRepositoryToken(User));
    verRepo = module.get(getRepositoryToken(Verification));
  });

  it('be define', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'saurabh@test.com',
      password: '',
      role: 0,
    };

    it('should fail if user exists', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1, email: 'saurabh@test.com' });
      const result = await service.createAccount(createAccountArgs);

      expect(result).toMatchObject({
        ok: false,
        error: 'User already exists with the same email.',
      });
    });

    it('should create a new user', async () => {
      userRepo.findOne.mockReturnValue(undefined);
      userRepo.create.mockReturnValue(createAccountArgs);
      userRepo.save.mockResolvedValue(createAccountArgs);
      verRepo.create.mockReturnValue(createAccountArgs);
      verRepo.save.mockResolvedValue({ code: 'asgasga-asgasga' });

      const result = await service.createAccount(createAccountArgs);

      expect(userRepo.create).toHaveBeenCalledTimes(1);
      expect(userRepo.create).toHaveBeenCalledWith(createAccountArgs);
      expect(userRepo.save).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalledWith(createAccountArgs);

      expect(verRepo.create).toHaveBeenCalled();
      expect(verRepo.create).toHaveBeenCalledWith({ user: createAccountArgs });
      expect(verRepo.save).toHaveBeenCalled();
      expect(verRepo.save).toHaveBeenCalledWith(createAccountArgs);

      expect(mailService.sendVerficationEmail).toHaveBeenCalled();
      expect(mailService.sendVerficationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );

      expect(result).toEqual({
        ok: true,
      });
    });
  });
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
