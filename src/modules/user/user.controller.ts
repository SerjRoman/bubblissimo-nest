import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Put,
	Delete,
	UseGuards,
	ParseUUIDPipe,
	Query,
	HttpCode,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { QueryUserDto } from './dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth-guard';
import { QueryUsersDto } from './dto/query-users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
	private readonly logger = new Logger(UserController.name);

	constructor(private readonly userService: UserService) {}

	@Get()
	@ApiOperation({ summary: 'Gets users' })
	@ApiQuery({ type: QueryUserDto })
	getAll(@Query() query: QueryUsersDto) {
		this.logger.log(`Received GET request /users/.`, {
			query,
		});
		return this.userService.getAll(query);
	}

	@Post()
	@ApiOperation({ summary: 'Create a new user' })
	@ApiResponse({
		status: 201,
		description: 'User created successfully.',
		type: UserEntity,
	})
	@ApiResponse({ status: 409, description: 'Conflict. User already exists.' })
	create(@Body() createUserDto: CreateUserDto) {
		this.logger.log(`Received POST request /users: ${createUserDto}`);
		return this.userService.create(createUserDto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a user by ID' })
	@ApiQuery({ type: QueryUserDto })
	@ApiParam({ name: 'id', description: 'User ID' })
	@ApiResponse({ status: 200, description: 'User found.', type: UserEntity })
	@ApiResponse({ status: 404, description: 'User not found.' })
	getById(@Param('id') id: string, @Query() query?: QueryUserDto) {
		this.logger.log(`Received GET request /users/:id. ID: ${id}`, {
			query,
		});
		return this.userService.getById(id, query);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update a user by ID' })
	@ApiResponse({
		status: 200,
		description: 'User updated successfully.',
		type: UserEntity,
	})
	@ApiResponse({ status: 404, description: 'User not found.' })
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		this.logger.log(
			JSON.stringify(
				`Received UPDATE request /users/:id. ID: ${id}, BODY: ${updateUserDto}`,
			),
		);
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a user by ID' })
	@ApiResponse({ status: 204, description: 'User deleted successfully.' })
	@ApiResponse({ status: 404, description: 'User not found.' })
	async delete(@Param('id', ParseUUIDPipe) id: string) {
		this.logger.log(`Received DELETE request /users/:id. ID: ${id}`);
		return await this.userService.delete(id);
	}
}
