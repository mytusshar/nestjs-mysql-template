import { Inject, Injectable } from '@nestjs/common';
import { InjectLogs } from '../../config/logger.config';

import { TEMP_REPOSITORY } from '../../constants';
import { Temp } from '../../entities/temp.entity';
import { CreateTempDto } from './dto/create-temp.dto';
import { UpdateTempDto } from './dto/update-temp.dto';

@Injectable()
@InjectLogs()
export class TempService {
    constructor(
        @Inject(TEMP_REPOSITORY)
        private tempRepository: typeof Temp
    ) {}

    async create(createTempDto: CreateTempDto) {
        return this.tempRepository.create<Temp>({ ...createTempDto });
    }

    findAll() {
        return this.tempRepository.findAll();
    }

    findOne(id: number) {
        return `This action returns a #${id} temp`;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    update(id: number, updateTempDto: UpdateTempDto) {
        return `This action updates a #${id} temp`;
    }

    remove(id: number) {
        return `This action removes a #${id} temp`;
    }
}
