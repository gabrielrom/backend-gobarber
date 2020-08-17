import AppError from '@shared/errors/AppError';

import FakeUsersRepositories from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepositories: FakeUsersRepositories;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepositories, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Jhon Doe',
      email: 'johndoe@gmail.com',
      password: '12345',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user with another users email', async () => {
    await createUser.execute({
      name: 'Jhon Doe',
      email: 'johndoe@gmail.com',
      password: '12345',
    });

    await expect(
      createUser.execute({
        name: 'Jhon Doe',
        email: 'johndoe@gmail.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
