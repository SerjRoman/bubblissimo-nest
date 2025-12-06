import { CreatePaginatedResponseDto } from '@common/dto';
import { QuizAccessType } from '@modules/quiz-access/enums';
import { TeacherProfileSummaryDto } from '@modules/user/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { QuizSummaryDto } from '../../../quiz/dto/quiz-summary.dto';

export class QuizAccessGetAllResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ enum: QuizAccessType })
    @Expose()
    accessType: QuizAccessType;

    @ApiProperty({ type: TeacherProfileSummaryDto, required: false })
    @Expose()
    @Type(() => TeacherProfileSummaryDto)
    teacher?: TeacherProfileSummaryDto;

    @ApiProperty({ type: QuizSummaryDto, required: false })
    @Expose()
    @Type(() => QuizSummaryDto)
    quiz?: QuizSummaryDto;
}

export class PaginatedQuizAccessGetAllResponseDto extends CreatePaginatedResponseDto(
    QuizAccessGetAllResponseDto,
) { }
