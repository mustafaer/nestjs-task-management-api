import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const exist = await this.findOne({ username, isDeleted: false });

    if (exist) {
      throw new BadRequestException('User already exist!');
    }

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username, isDeleted: false });

    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }

  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}