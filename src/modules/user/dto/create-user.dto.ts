import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  userName: string;
  @IsNotEmpty()
  passWord: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  nikeName: string;
}
