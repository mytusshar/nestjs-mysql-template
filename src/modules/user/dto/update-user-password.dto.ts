import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserPasswordDto {
    @ApiProperty({
        example: 'pass@123',
        description: 'Password'
    })
    password: string;
}
