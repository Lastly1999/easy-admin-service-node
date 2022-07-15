import { Global, Module } from '@nestjs/common';
import { UtilService } from './util.service';

@Module({
    providers: [UtilService],
    exports: [UtilService],
})
@Global()
export class UtilModule {}
