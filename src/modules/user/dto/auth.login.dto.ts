import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail, IsString, MinLength
} from 'class-validator';

export class AuthLoginDto {

    @ApiProperty({ description: "Please provide email", default: "test@gmail.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "Please provide Password", default: "password" })
    @IsString()
    @MinLength(6)
    password: string;
}
