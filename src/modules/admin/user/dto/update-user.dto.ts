import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    readonly userName: string;
    @IsNotEmpty()
    readonly name: string;
    @IsNotEmpty()
    readonly email: string;
    @IsNotEmpty()
    readonly nikeName: string;
}
