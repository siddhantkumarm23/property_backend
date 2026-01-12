import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail, IsEnum, IsNumber,
    IsOptional,
    IsString, MaxLength,
    MinLength
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @ApiProperty({ description: "Please provide First name", default: "fname" })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    fName: string;

    @ApiProperty({ description: "Please provide Last name", default: "Lname" })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lName: string;

    @ApiProperty({ description: "Please provide email", default: "test@gmail.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "Please provide Password", default: "password" })
    @IsString()
    @IsOptional()
    @MinLength(6)
    password: string;

    @ApiProperty({ description: "Please provide county code", default: "+91" })
    @IsString()
    countryCode: string;

    @ApiProperty({ description: "Please provide mobile number", default: "8527796423" })
    @IsNumber()
    mobile: number;

    @ApiProperty({ description: "Please provide property id", default: "691da39604a4b1afd8df302c" })
    @IsString()
    @IsOptional()
    stayId: string;


    @ApiProperty({
        enum: UserRole,
        description: 'Role of the user (ADMIN / USER)',
    })
    @IsEnum(UserRole)
    role: UserRole;


    @ApiProperty({ description: "Please provide image", default: "url only" })
    @IsOptional()
    @IsString()
    // Add validation like @IsUrl() if the image is always a URL
    image?: string;


    @ApiProperty({ description: "Please provide IsPrimaryUser", default: false })
    @IsOptional()
    @IsBoolean()
    // Add validation like @IsUrl() if the image is always a URL
    isPrimaryUser?: string;
}
