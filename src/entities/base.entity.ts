import {
    Column,
    Model,
    DataType,
    AllowNull,
    CreatedAt,
    Default,
    UpdatedAt,
    AutoIncrement,
    PrimaryKey
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Status } from '../enums/status.enum';

export class Base extends Model {
    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    id: number;

    @AllowNull(true)
    @CreatedAt
    @Default(DataTypes.NOW)
    @Column
    created_at: Date;

    @AllowNull(true)
    @UpdatedAt
    @Default(DataTypes.NOW)
    @Column
    updated_at: Date;

    @AllowNull(true)
    @Column({ type: DataType.INTEGER })
    created_by: number;

    @AllowNull(true)
    @Column({ type: DataType.INTEGER })
    updated_by: number;

    @Column({ type: DataType.ENUM, values: Object.values(Status) })
    status: Status;
}
