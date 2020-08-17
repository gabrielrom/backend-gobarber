import { uuid } from 'uuidv4';

import UserTokens from '../../infra/typeorm/entities/UserTokens';
import IUserTokensRepository from '../IUserTokensRepository';

class FakeUserTokensRepository implements IUserTokensRepository {
  private tokens: UserTokens[] = [];

  public async generate(user_id: string): Promise<UserTokens> {
    const userTokens = new UserTokens();

    Object.assign(userTokens, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.tokens.push(userTokens);

    return userTokens;
  }

  public async findByToken(token: string): Promise<UserTokens | undefined> {
    const userToken = this.tokens.find(findToken => findToken.token === token);

    return userToken;
  }
}

export default FakeUserTokensRepository;
