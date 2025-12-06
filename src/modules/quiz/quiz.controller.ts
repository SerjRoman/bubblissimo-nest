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
import {
	TeacherIdDecorator,
	UserDecorator,
	type UserFromTokenPayload,
} from '@common/decorators';
import {
	QuizCreateDto,
	QuizGetAllQueryDto,
	PaginatedQuizGetAllResponse,
	QuizToggleFavouriteDto,
	QuizCopyDto,
	QuizQueryDto,
	QuizParamDto,
} from './dto';
import { TeacherViewType } from './enums';

@ApiTags('Quizzes')
@ApiBearerAuth()
@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizController {
	private readonly logger = new Logger(QuizController.name);

	constructor(private readonly quizService: QuizService) {}
	@ApiOkResponse({
		description: "Successful response with all teacher's quizzes",
		type: PaginatedQuizGetAllResponse,
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
		@TeacherIdDecorator() teacherId: string,
		@Param('viewType') viewType: TeacherViewType = TeacherViewType.ALL,
		@Query() query: QuizGetAllQueryDto,
	): Promise<PaginatedQuizGetAllResponse> {
		this.logger.log('GET /teacher/my/ request', query);
		return this.quizService.getAllForTeacher(
			user.userId,
			teacherId,
			viewType,
			query,
		);
	}

	@Post('')
	@UseGuards(TeacherGuard)
	create(
		@Body() body: QuizCreateDto,
		@TeacherIdDecorator() teacherId: string,
	) {
		return this.quizService.create(teacherId, body);
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
		@TeacherIdDecorator() teacherId: string,
	) {
		return this.quizService.delete(quizId, teacherId);
	}
	@UseGuards(TeacherGuard)
	@Post('teacher/copy')
	copyQuiz(
		@Body() body: QuizCopyDto,
		@UserDecorator() user: UserFromTokenPayload,
		@TeacherIdDecorator() teacherId: string,
	) {
		return this.quizService.copyQuiz(user.userId, teacherId, body);
	}
	@UseGuards(TeacherGuard)
	@ApiParam({ type: 'string', name: 'id' })
	@Get(':id')
	getById(@Query() query: QuizQueryDto, @Param() { id }: QuizParamDto) {
		console.log(id);
		return this.quizService.getById(id, query);
	}
}
