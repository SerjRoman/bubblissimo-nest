import { Role } from "@modules/user/enums";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AuthenticatedUserResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    firstName: string;

    @ApiProperty()
    @Expose()
    lastName: string;

    @ApiProperty()
    @Expose()
    avatar: string | null;

    @ApiProperty({ enum: Role })
    @Expose()
    roles: Role[];

    @ApiProperty()
    @Expose()
    email: string;
}