import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTempDto {
    @ApiProperty({ example: 'John', description: 'Name of user' })
    @IsNotEmpty()
    name: string;
}
