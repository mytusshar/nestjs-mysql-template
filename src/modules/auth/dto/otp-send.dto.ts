import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OtpSendDto {
    @ApiProperty({ example: '33333333333', description: 'User Id' })
    @IsNotEmpty()
    mobile: string;

    @ApiProperty({
        example: 'customer',
        description: 'Type of user (super_admin, customer, store_owner, service_provider, vet_doctor, clinic, merchant)'
    })
    @IsNotEmpty()
    user_type: string;
}
