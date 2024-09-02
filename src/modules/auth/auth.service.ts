import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserType } from '../../enums/user-type.enum';
import { SignUpDto } from './dto/signup.dto';
import { AppUtils } from '../../utils/app.utils';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpSendDto } from './dto/otp-send.dto';
import { InjectLogs } from '../../config/logger.config';

@Injectable()
@InjectLogs()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async validateUserWithType(userId: string, password: string, user_type: UserType) {
        const findUser = await this.userService.queryOne({ mobile: userId, user_type });
        if (!findUser) throw new UnauthorizedException('Invalid username or password or user not found');
        const userPassword = await this.userService.getUserPassword(findUser.id);
        const isValid = await bcrypt.compare(password, userPassword);
        if (!isValid) throw new UnauthorizedException('Invalid username or password');
        return findUser;
    }

    async validateUser(userId: string, password: string) {
        const findUser = await this.userService.queryOne({ mobile: userId });
        if (!findUser) throw new UnauthorizedException('Invalid username or password or user not found');
        const userPassword = await this.userService.getUserPassword(findUser.id);
        const isValid = await bcrypt.compare(password, userPassword);
        if (!isValid) throw new UnauthorizedException('Invalid username or password');
        return findUser;
    }

    async signUp(signUpDto: SignUpDto, user_type: UserType) {
        const resp = await this.userService.signUpUser(signUpDto, user_type);
        await this.sendOtp({ mobile: resp.mobile, user_type });
        return resp;
    }

    async sendOtp(otpSendDto: OtpSendDto) {
        const { mobile, user_type } = otpSendDto;
        const user = await this.userService.queryOne({ mobile, user_type });
        if (!user) {
            throw new NotFoundException(`User Not Found`);
        }
        const otp = await AppUtils.generateAndSendOtp(user.mobile);
        const resp = await this.userService.addOtpToUser(user.id, otp);
        return resp;
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const otpVerifyResp = await this.userService.verifyUserOtp(verifyOtpDto);
        const { mobile, user_type } = verifyOtpDto;
        const user = await this.userService.queryOne({ mobile, user_type });
        const resp = this.processLogin(user);
        return resp;
    }

    // User Login API
    async userTypeLogin(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.mobile, loginDto.password);
        return this.processLogin(user);
    }

    // Super Admin Login API
    async superAdminLogin(dto: LoginDto) {
        const user = await this.validateUserWithType(dto.mobile, dto.password, UserType.SUPER_ADMIN);
        return this.processLogin(user);
    }

    async processLogin(user) {
        const { id, email, mobile, first_name, last_name, user_type } = user;
        return {
            access_token: this.jwtService.sign({
                sub: id,
                email,
                mobile,
                first_name,
                last_name,
                user_type,
                type_id: await this.getTypeId(id, user_type)
            }),
            user,
            type_id: await this.getTypeId(id, user_type)
        };
    }

    async getTypeId(user_id: number, user_type: UserType) {
        let entity;
        switch (user_type) {
            case UserType.CUSTOMER:
                return user_id;
            default:
                return null;
        }
        return entity?.id;
    }
}
