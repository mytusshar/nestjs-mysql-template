import * as moment from 'moment';
import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../constants';
import { User } from '../../entities/user.entity';
import { UserType } from '../../enums/user-type.enum';
import { AppUtils } from '../../utils/app.utils';
import { SignUpDto } from '../auth/dto/signup.dto';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { Status } from '../../enums/status.enum';
import { TableNameTagsEnum } from '../../enums/table-name-tags.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

import { Transaction } from 'sequelize';
import { InjectLogs } from '../../config/logger.config';

const tableNameTag: string = TableNameTagsEnum.USERS;
const OTP_EXPIRY_MIN = 4;

@Injectable()
@InjectLogs()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY)
        private userRepository: typeof User
    ) {}

    async getUserPassword(id: number) {
        const user = await this.userRepository.findOne<User>({
            where: { id, status: Status.ACTIVE }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user.password;
    }

    async queryOne(filter: any) {
        return this.userRepository.findOne({
            where: filter,
            attributes: {
                exclude: ['password', 'otp', 'otp_expiry']
            }
        });
    }

    async findOne(id: number) {
        return await this.userRepository.findOne<User>({
            where: { id, status: Status.ACTIVE },
            attributes: {
                exclude: ['password', 'otp', 'otp_expiry']
            }
        });
    }

    async update(updated_by: number, id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { id, status: Status.ACTIVE } });
        if (!user) {
            throw new NotFoundException(`${tableNameTag} Not Found`);
        }
        await this.userRepository.update<User>(
            {
                ...updateUserDto,
                updated_by
            },
            { where: { id } }
        );
    }

    async updateUserPassword(
        updated_by: number,
        id: number,
        updateUserPasswordDto: UpdateUserPasswordDto,
        transaction: Transaction = null
    ) {
        const user = await this.userRepository.findOne({ where: { id, status: Status.ACTIVE } });
        if (!user) {
            throw new NotFoundException(`${tableNameTag} Not Found`);
        }
        const { password } = updateUserPasswordDto;
        const hashedPassword = await AppUtils.getEncryptedPassword(password);
        await this.userRepository.update<User>(
            {
                updated_by,
                password: hashedPassword
            },
            { where: { id }, transaction }
        );
    }

    async updateUserMobile(
        updated_by: number,
        id: number,
        mobile: string,
        user_type: UserType,
        transaction: Transaction
    ) {
        await this.isUserAlreadyExist(user_type, mobile);
        await this.userRepository.update<User>(
            {
                updated_by,
                mobile
            },
            { where: { id }, transaction }
        );
    }

    async updateUserEmail(updated_by: number, id: number, email: string, transaction: Transaction) {
        await this.userRepository.update<User>(
            {
                updated_by,
                email
            },
            { where: { id }, transaction }
        );
    }

    async updateServiceProviderUserDetails(
        dto: { password: string; email: string; mobile: string; user_type: UserType },
        user: User,
        updated_by,
        transaction: Transaction
    ) {
        if (!AppUtils.isEqualString(user.mobile, dto.mobile)) {
            await this.updateUserMobile(updated_by, user.id, dto.mobile, dto.user_type, transaction);
        }
        if (!AppUtils.isEqualString(user.email, dto.email)) {
            await this.updateUserEmail(updated_by, user.id, dto.email, transaction);
        }
        if (!AppUtils.isEmptyString(dto.password)) {
            // Force change of password
            await this.updateUserPassword(
                updated_by,
                user.id,
                {
                    password: dto.password
                },
                transaction
            );
        }
    }

    async delete(id: number) {
        const user = await this.userRepository.findOne({
            where: { id }
        });
        if (!user) {
            throw new NotFoundException(`${tableNameTag} Not Found`);
        }
        await this.userRepository.update<User>(
            {
                status: Status.DELETED
            },
            { where: { id } }
        );
    }

    validatePassword(password) {
        if (!password || password.trim() == '') {
            throw new BadRequestException('Invalid Password');
        }
    }

    async isUserAlreadyExist(user_type: UserType, mobile: string) {
        const user = await this.queryOne({ mobile, user_type });
        if (user) {
            throw new BadRequestException('User with this mobile number already exit!');
        }
    }

    async signUpUser(signUpDto: SignUpDto, user_type: UserType, transaction = null): Promise<User> {
        const user = await this.queryOne({ mobile: signUpDto.mobile, user_type });
        if (user) {
            throw new BadRequestException('You are already registered in the system!');
        }
        this.validatePassword(signUpDto.password);
        const { first_name, last_name, mobile } = signUpDto;
        const hashedPassword = await AppUtils.getEncryptedPassword(signUpDto.password);
        let newUser = await this.userRepository.create(
            {
                user_type,
                first_name,
                email: signUpDto.email,
                last_name,
                mobile,
                password: hashedPassword
            },
            {
                transaction
            }
        );
        newUser.setDataValue('password', null);
        newUser.setDataValue('otp', null);
        newUser.setDataValue('otp_expiry', null);
        return newUser;
    }

    async addOtpToUser(id: number, otp: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User Not Found`);
        }
        return await this.userRepository.update<User>(
            {
                otp,
                is_phone_verified: false,
                otp_expiry: AppUtils.getUtcMoment().add(OTP_EXPIRY_MIN, 'minutes').format()
            },
            { where: { id } }
        );
    }

    async verifyUserOtp(verifyOtpDto: VerifyOtpDto) {
        const { mobile, user_type } = verifyOtpDto;
        const user = await this.userRepository.findOne({ where: { mobile, user_type } });
        if (!user) {
            throw new NotFoundException(`User Not Found`);
        }
        if (user.otp !== verifyOtpDto.otp) {
            throw new UnauthorizedException('Invalid OTP');
        }
        const currentMoment = AppUtils.getUtcMoment();
        if (!moment(user.otp_expiry).isAfter(currentMoment)) {
            throw new UnauthorizedException('OTP Expired');
        }
        // removing OTP and otpExpiry from table
        const userId = user.id;
        await this.userRepository.update<User>(
            { otp: null, otp_expiry: null, is_phone_verified: true },
            { where: { id: userId } }
        );
        return 'OTP verified successfully';
    }
}
