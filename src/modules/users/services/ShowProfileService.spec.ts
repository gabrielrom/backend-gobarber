import AppError from '@shared/errors/AppError';

import FakeUsersRepositories from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepositories: FakeUsersRepositories;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    showProfile = new ShowProfileService(fakeUsersRepositories);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@gmail.com');
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
