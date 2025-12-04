import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language, Subject, Tag } from './entities';

@Module({
	imports: [TypeOrmModule.forFeature([Tag, Language, Subject])],
})
export class TaxonomyModule {}
