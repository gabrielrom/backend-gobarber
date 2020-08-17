import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepositories from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepositories: FakeUsersRepositories;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepositories,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar of a user', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '1234',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepositories.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '1234',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});