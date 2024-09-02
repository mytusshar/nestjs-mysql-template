import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ example: 'John', description: 'First Name' })
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({ example: 'Doe', description: 'Last name' })
    last_name: string;

    @ApiPropertyOptional({ example: 'user@gmail.com', description: 'User email' })
    email: string;

    @ApiProperty({ example: '11111111', description: 'Contact number' })
    mobile: string;

    @ApiPropertyOptional({ example: 'Male', description: 'Gender' })
    gender?: string;

    @ApiPropertyOptional({ description: 'Date of Birth', example: '2022-05-16T08:22:50.584Z' })
    dob?: string;
}
