import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    readonly userName: string;
    @IsNotEmpty()
    readonly passWord: string;
    @IsNotEmpty()
    readonly email: string;
    @IsNotEmpty()
    readonly nikeName: string;
}
