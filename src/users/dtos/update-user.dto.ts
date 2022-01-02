import { IsEmail, IsString, IsOptional } from "class-validator";

export class UpdateUserDto{
    @IsEmail()
    @IsOptional()
    email: string

    @IsEmail()
    @IsOptional()
    password: string
}