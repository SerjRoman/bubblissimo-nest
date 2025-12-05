import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language, Subject, Tag } from './entities';
import { TaxonomyController } from './taxonomy.controller';
import { TaxonomyService } from './taxonomy.service';

@Module({
	imports: [TypeOrmModule.forFeature([Tag, Language, Subject])],
	controllers: [TaxonomyController],
	providers: [TaxonomyService],
	exports: [TaxonomyService],
})
export class TaxonomyModule {}
