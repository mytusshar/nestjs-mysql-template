import { Injectable } from '@nestjs/common';
import { PrintLog } from './config/logger.config';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}
