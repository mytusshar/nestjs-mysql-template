import { TEMP_REPOSITORY } from '../../constants';
import { Temp } from '../../entities/temp.entity';

export const tempProviders = [
    {
        provide: TEMP_REPOSITORY,
        useValue: Temp
    }
];
