import { IsNotEmpty } from 'class-validator';

export class FindUserDto {
    @IsNotEmpty()
    userName: string;
    @IsNotEmpty()
    passWord: string;
}
