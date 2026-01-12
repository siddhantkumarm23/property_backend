import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateStayDto {
    @ApiProperty({ description: "Please provide stay name", default: "test" })
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    name: string;

    @ApiProperty({ description: "Please provide start Date", default: "MM/DD/YYY" })
    @IsString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ description: "Please provide end name", default: "MM/DD/YYY" })
    @IsString()
    @IsNotEmpty()
    endDate: string;

    @ApiProperty({ description: "Please provide property id", default: "691da39604a4b1afd8df302c" })
    @IsString()
    @IsNotEmpty()
    propertyId: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    isActive: boolean;
}

