import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import {
    ApiOperation,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    ApiTags,
    ApiParam
} from '@nestjs/swagger';
import { PrintLog } from '../../config/logger.config';
import { TransformInterceptor } from '../../core/transform.interceptor';
import { UserType } from '../../enums/user-type.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { OtpSendDto } from './dto/otp-send.dto';
import { SignUpDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller({
    path: 'auth',
    version: '1'
})
@ApiTags('Auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup/customer')
    @ApiOperation({ summary: 'Signup user' })
    @ApiOkResponse({
        description: 'User signed up successfully'
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid username or password'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async signUp(@Body() signUpDto: SignUpDto) {
        const data = await this.authService.signUp(signUpDto, UserType.CUSTOMER);
        return { message: 'User signed up successfully', data };
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login user' })
    @ApiOkResponse({
        description: 'User logged in successfully'
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid username or password'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async customerLogin(@Body() loginDto: LoginDto) {
        const data = await this.authService.userTypeLogin(loginDto);
        return { message: 'User logged in successfully', data };
    }

    @Post('/login/super-admin')
    @ApiOperation({ summary: 'Login user' })
    @ApiOkResponse({
        description: 'User logged in successfully'
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid username or password'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async superAdminLogin(@Body() loginDto: LoginDto) {
        const data = await this.authService.superAdminLogin(loginDto);
        return { message: 'User logged in successfully', data };
    }

    @Post('/otp/send/')
    @ApiOperation({ summary: 'Send OTP' })
    @ApiOkResponse({
        description: 'OTP sent successfully'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async sendOtp(@Body() otpSendDto: OtpSendDto) {
        const data = await this.authService.sendOtp(otpSendDto);
        return { message: 'Otp sent successfully', data };
    }

    @Post('/otp/verify/')
    @ApiOperation({ summary: 'Verify OTP' })
    @ApiOkResponse({
        description: 'OTP verified successfully'
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid OTP or expired'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async verifyOtp2(@Body() verifyOtpDto: VerifyOtpDto) {
        const data = await this.authService.verifyOtp(verifyOtpDto);
        return { message: 'Otp verified successfully', data };
    }
}
