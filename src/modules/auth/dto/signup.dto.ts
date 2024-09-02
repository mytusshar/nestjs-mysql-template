import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignUpDto {
    @ApiProperty({ example: 'John', description: 'First name' })
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({ example: 'Doe', description: 'Last name' })
    @IsNotEmpty()
    last_name: string;

    @ApiProperty({ example: '1111111111', description: 'Phone number' })
    @IsNotEmpty()
    mobile: string;

    @ApiProperty({ example: 'john@pp.com', description: 'Email optional' })
    email: string;

    @ApiProperty({ example: 'test123', description: 'Password' })
    @IsNotEmpty()
    password: string;
}
