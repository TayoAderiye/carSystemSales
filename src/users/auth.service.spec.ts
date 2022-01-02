import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';


describe('AuthService', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = []
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 99999), email, password} as User
                users.push(user)
                return Promise.resolve(user)
            }
        }
        const module = await Test.createTestingModule({
            providers:[
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile()
    
        service = module.get(AuthService)
    })
    it('can create an instance of auth service',async () => {
        expect(service).toBeDefined()
    })

    it('creates a new user with a salted and hashed password',async () => {
        const user = await service.signup('assdsd@sdsd.com', 'asdf')

        expect(user.password).not.toEqual('asdf')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throws an error if user signs up with email that is in use',async () => {
        await service.signup('assdsd@sdsd.com', 'asdf')
        try
        {
            await service.signup('assdsd@sdsd.com', 'asdf')
        } catch (err) 
        {
            expect(err).toBeInstanceOf(BadRequestException);
        }
    })

    it('throws if signin is called with an unused email', async () => {
        try {
          await service.signin('asdflkj@asdlfkj.com', 'passdflkj');
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toBe('User not Found');
        }
      });

    it('throws if an invalid password is provided',async () => {
        await service.signup('assdsd@sdsd.com', 'password')

        try
        {
            await service.signin('assdsd@sdsd.com', 'passwordss')
        } catch (err) 
        {
            expect(err).toBeInstanceOf(BadRequestException);
        }
    })

    it('returns a user if correct password is provided',async () => {
        await service.signup('sdasd@gmail.com', 'mypassword')

        const user = await service.signin('sdasd@gmail.com', 'mypassword')
        
        expect(user).toBeDefined()

    })
})
