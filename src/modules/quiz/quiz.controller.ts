import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { TeacherViewType } from './enums';
import { QuizService } from './quiz.service';
import { JwtAuthGuard, TeacherGuard } from '@auth/index';
import {
	ApiTags,
	ApiBearerAuth,
	ApiParam,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiBody,
} from '@nestjs/swagger';
import { UserDecorator, type UserFromTokenPayload } from '@common/decorators';
import {
	QuizCreateDto,
	QuizGetAllQueryDto,
	PaginatedQuizResponse,
	QuizToggleFavouriteDto,
} from './dto';
import { QuizCopyDto } from './dto/quiz-copy.dto';

@ApiTags('Quizzes')
@ApiBearerAuth()
@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizController {
	private readonly logger = new Logger(QuizController.name);

	constructor(private readonly quizService: QuizService) {}
	@ApiOkResponse({
		description: "Successful response with all teacher's quizzes",
		type: PaginatedQuizResponse,
	})
	@ApiUnauthorizedResponse({ description: 'User is unauthenticated' })
	@ApiForbiddenResponse({
		description: 'Access is forbidded for non teacher users',
	})
	@ApiParam({
		name: 'viewType',
		enum: TeacherViewType,
	})
	@UseGuards(TeacherGuard)
	@Get('/teacher/my/:viewType')
	getAllForTeacher(
		@UserDecorator() user: UserFromTokenPayload,
		@Param('viewType') viewType: TeacherViewType = TeacherViewType.ALL,
		@Query() query: QuizGetAllQueryDto,
	) {
		this.logger.log('GET /teacher/my/ request', query);
		return this.quizService.getAllForTeacher(
			user.userId,
			user.teacherId!,
			viewType,
			query,
		);
	}

	@Post('')
	@UseGuards(TeacherGuard)
	create(
		@Body() body: QuizCreateDto,
		@UserDecorator() user: UserFromTokenPayload,
	) {
		return this.quizService.create(user.teacherId!, body);
	}

	@ApiOkResponse({
		description: 'Successful response with updated favourite quiz',
	})
	@ApiBody({ type: QuizToggleFavouriteDto })
	@Patch('favourite/toggle')
	toggleFavourite(
		@Body() body: QuizToggleFavouriteDto,
		@UserDecorator() user: UserFromTokenPayload,
	) {
		return this.quizService.toggleFavourite(user.userId, body);
	}

	@UseGuards(TeacherGuard)
	@Delete(':id')
	delete(
		@Param('id') quizId: string,
		@UserDecorator() user: UserFromTokenPayload,
	) {
		return this.quizService.delete(quizId, user.teacherId!);
	}
	@UseGuards(TeacherGuard)
	@Post('teacher/copy')
	copyQuiz(
		@Body() body: QuizCopyDto,
		@UserDecorator() user: UserFromTokenPayload,
	) {
		return this.quizService.copyQuiz(user.userId, user.teacherId!, body);
	}
}
