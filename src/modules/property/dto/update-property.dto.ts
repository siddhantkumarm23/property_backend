
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePropertyDto {
    @ApiProperty({ description: "Update property name", required: false })
    @IsOptional()
    @IsString()
    @Length(2, 100)
    name?: string;

    @ApiProperty({ description: "Update property address", required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ description: "Update property image URL", required: false })
    @IsOptional()
    @IsString()
    // You may add @IsUrl() if needed
    image?: string;
}
