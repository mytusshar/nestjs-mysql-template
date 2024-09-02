import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({ example: '123456', description: 'OTP' })
    @IsNotEmpty()
    otp: number;

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
