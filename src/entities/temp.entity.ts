import { Table, Column, DataType, AllowNull } from 'sequelize-typescript';
import { Base } from './base.entity';

@Table({
    tableName: 'temp'
})
export class Temp extends Base {
    @AllowNull(false)
    @Column({ type: DataType.STRING })
    name: string;
}
