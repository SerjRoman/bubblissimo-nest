import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAccess } from './entities';
import { QuizAccessController } from './quiz-access.controller';
import { QuizAccessService } from './quiz-access.service';

@Module({
	imports: [TypeOrmModule.forFeature([QuizAccess])],
	controllers: [QuizAccessController],
	providers: [QuizAccessService],
	exports: [QuizAccessService],
})
export class QuizAccessModule {}
