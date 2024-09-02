import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OtpDto {
    @ApiProperty({ example: '6', description: 'User Id' })
    @IsNotEmpty()
    id: number;
}
