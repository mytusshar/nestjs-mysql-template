import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: '8888888881', description: 'mobile number' })
    @IsNotEmpty()
    mobile: string;

    @ApiProperty({ example: 'Admin!23', description: 'Password' })
    password: string;
}
