import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	PaginatedQuizAccessGetAllResponseDto,
	QuizAccessCreateDto,
	QuizAccessDeletParamDto,
	QuizAccessGetAllQueryDto,
	QuizAccessParamDto,
	QuizAccessTransferOwnershipDto,
	QuizAccessUpdateDto,
	QuizAccessUpdateParamDto,
} from './dto';
import { JwtAuthGuard, TeacherGuard } from '@auth/index';
import { TeacherIdDecorator } from '@common/decorators';
import { QuizAccessService } from './quiz-access.service';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { QuizAccess } from './entities';

@Controller('quiz-accesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TeacherGuard)
export class QuizAccessController {
	private readonly logger = new Logger(QuizAccessController.name);

	constructor(private readonly quizAccessService: QuizAccessService) {}

	@ApiOperation({ summary: 'Grant access to a quiz to another teacher' })
	@ApiCreatedResponse({
		description: 'Access has been successfully granted.',
		type: QuizAccess,
	})
	@ApiForbiddenResponse({
		description: 'Forbidden. Only the quiz owner can grant access.',
	})
	@ApiNotFoundResponse({
		description: 'Quiz or Teacher to be granted access not found.',
	})
	@Post(':quizId/accesses')
	grantAccess(
		@Param() { quizId }: QuizAccessParamDto,
		@Body() body: QuizAccessCreateDto,
		@TeacherIdDecorator() teacherId: string,
	) {
		return this.quizAccessService.grantAccess(teacherId, quizId, body);
	}
	@ApiOperation({
		summary: 'Get a list of all teachers with access to a quiz',
	})
	@ApiOkResponse({
		description: 'A paginated list of quiz access records.',
		type: PaginatedQuizAccessGetAllResponseDto,
	})
	@ApiForbiddenResponse({
		description: 'Forbidden. Only the quiz owner can view access list.',
	})
	@ApiNotFoundResponse({ description: 'Quiz not found.' })
	@Get(':quizId/accesses')
	getAllAccessesByQuiz(
		@Param() { quizId }: QuizAccessParamDto,
		@TeacherIdDecorator() teacherId: string,
		@Query() query: QuizAccessGetAllQueryDto,
	): Promise<PaginatedQuizAccessGetAllResponseDto> {
		this.logger.log('GET :quizId/accesses', { query });
		return this.quizAccessService.getAllAccessesByQuiz(
			teacherId,
			quizId,
			query,
		);
	}

	@ApiOperation({ summary: "Update a teacher's access type for a quiz" })
	@ApiOkResponse({
		description: 'The access type has been successfully updated.',
		type: QuizAccess,
	})
	@ApiForbiddenResponse({
		description: 'Forbidden. Only the quiz owner can update access.',
	})
	@ApiNotFoundResponse({ description: 'Quiz or Access record not found.' })
	@Patch(':quizId/accesses/:accessId')
	updateAccess(
		@Param() params: QuizAccessUpdateParamDto,
		@Body() body: QuizAccessUpdateDto,
		@TeacherIdDecorator() teacherId: string,
	) {
		return this.quizAccessService.updateAccess(
			teacherId,
			params.quizId,
			params.accessId,
			body,
		);
	}
	@Put(':quizId/accesses/owner')
	transferOwnership(
		@Param() params: QuizAccessParamDto,
		body: QuizAccessTransferOwnershipDto,
		@TeacherIdDecorator() teacherId: string,
	) {
		return this.quizAccessService.transferOwnership(
			teacherId,
			params.quizId,
			body,
		);
	}

	@Delete(':quizId/accesses/:accessId')
	revokeAccess(
		@Param() params: QuizAccessDeletParamDto,
		@TeacherIdDecorator() teacherId: string,
	) {
		return this.quizAccessService.revokeAccess(
			teacherId,
			params.quizId,
			params.accessId,
		);
	}
}
