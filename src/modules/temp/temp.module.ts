import { Module } from '@nestjs/common';
import { TempService } from './temp.service';
import { TempController } from './temp.controller';
import { tempProviders } from '../../db/providers/temp.providers';

@Module({
    imports: [],
    controllers: [TempController],
    providers: [TempService, ...tempProviders]
})
export class TempModule {}
