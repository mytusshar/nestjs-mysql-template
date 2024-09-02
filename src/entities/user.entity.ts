import { Table, Column, DataType, AllowNull, HasMany } from 'sequelize-typescript';
import { UserType } from '../enums/user-type.enum';
import { Base } from './base.entity';

@Table({
    tableName: 'users'
})
export class User extends Base {
    @Column(DataType.VIRTUAL)
    get full_name() {
        return this.getDataValue('first_name') + ' ' + this.getDataValue('last_name');
    }

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    first_name: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    last_name: string;

    @AllowNull(true)
    @Column({ type: DataType.STRING })
    email: string;

    @AllowNull(false)
    @Column({
        type: DataType.ENUM,
        values: Object.values(UserType)
    })
    user_type: UserType;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    mobile: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    password: string;

    @AllowNull(false)
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    is_phone_verified: boolean;

    @AllowNull(true)
    @Column({ type: DataType.STRING })
    gender: string;

    @AllowNull(true)
    @Column({ type: DataType.DATE })
    dob: string;

    @AllowNull(true)
    @Column({ type: DataType.INTEGER })
    otp: number;

    @AllowNull(true)
    @Column({ type: DataType.NOW })
    otp_expiry: Date;
}
