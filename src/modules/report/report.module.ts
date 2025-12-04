import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities';

@Module({
	imports: [TypeOrmModule.forFeature([Report])],
})
export class ReportModule {}
