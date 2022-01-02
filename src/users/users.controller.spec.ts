import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: 'asdsd@gmail.com', password: 'dsdsfsf'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'dsfssfsf'} as User])
      },
      // remove: () => {},
      // update: () => {}
    }
    fakeAuthService = {
      // signup:() => {},
      signin:(email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdsd@gmail.com')
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('asdsd@gmail.com')
  });

  it('finduser returns a single user with the given id', async () => {
    const user = await controller.findUser('1')
    expect(user).toBeDefined()

  });

  it('finduser throws an error if user with given ID is not found', async () => {
    fakeUsersService.findOne = () => null

    try 
    {
      await controller.findUser('1')
    } catch (err)
    {
      expect(err).toBeInstanceOf(NotFoundException);
    }

  });

  it('signin updates session object and return user', async () => {
    const session = {userId: -10}
    const user = await controller.signin({email: 'sfsd@gmai.com', password: 'dsdsfsfsf'}, session)

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)

  });



});
