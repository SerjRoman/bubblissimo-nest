import { Module } from '@nestjs/common';
import { HashUtil } from './hash.util';

@Module({
	providers: [HashUtil],
	exports: [HashUtil],
})
export class SharedUtilsModule {}
