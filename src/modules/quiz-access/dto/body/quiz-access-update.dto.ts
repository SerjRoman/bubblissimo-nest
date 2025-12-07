import { QuizAccessType } from '@modules/quiz-access/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, NotEquals } from 'class-validator';

export class QuizAccessUpdateDto {
    @ApiProperty({
        enum: QuizAccessType,
        required: true,
        enumName: 'Quiz access type',
        description:
            'Type of the access to update for the access. Excluding OWNER',
        default: QuizAccessType.VIEWER,
    })
    @IsEnum(QuizAccessType)
    @NotEquals(QuizAccessType.OWNER)
    accessType: Exclude<QuizAccessType, QuizAccessType.OWNER>;
}
