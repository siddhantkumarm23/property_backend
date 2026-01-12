
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePropertyDto {

    @ApiProperty({ description: "Please provide property name", default: "test" })
    @IsString()
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @Length(2, 100)
    name: string;

    @ApiProperty({ description: "Please provide address", default: "C-32,delhi, 110044" })
    @IsString()
    @IsNotEmpty({ message: 'Address cannot be empty' })
    address: string;

    @ApiProperty({ description: "Please provide image", default: "url only" })
    @IsOptional()
    @IsString()
    // Add validation like @IsUrl() if the image is always a URL
    image?: string;
}
