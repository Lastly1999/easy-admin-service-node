import { Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/find-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async getUser(findUserDto: FindUserDto) {
    await this.userService.getUser(findUserDto);
    return null;
  }
}
