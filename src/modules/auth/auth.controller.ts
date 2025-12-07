import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { LoginDto, RefreshDto, RegisterUserDto } from './dto';
import { AuthService } from './auth.service';
import { UserDecorator, type UserFromTokenPayload } from '@common/decorators';
import { JwtAuthGuard } from '@auth/guards/jwt-auth-guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name);

	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@ApiOperation({ summary: 'Login user and returns auth tokens' })
	@ApiResponse({
		status: 200,
		description: 'User logged in successfully',
	})
	@ApiResponse({ status: 401, description: 'Invalid credentials.' })
	@ApiResponse({ status: 404, description: 'User not found.' })
	login(@Body() loginDto: LoginDto) {
		this.logger.log(`Received POST request /login: ${loginDto}`);
		return this.authService.login(loginDto);
	}

	@Post('register')
	@ApiOperation({ summary: 'Registers a new user and returns auth tokens' })
	@ApiResponse({
		status: 201,
		description: 'User successfully created and auth tokens returned',
	})
	@ApiResponse({
		status: 409,
		description: 'Conflict. User with such email already exists.',
	})
	register(@Body() registerDto: RegisterUserDto) {
		this.logger.log(`Received POST request /register: ${registerDto}`);
		return this.authService.register(registerDto);
	}

	@Post('refresh')
	@ApiOperation({
		summary: 'Accepts refresh token and returns new access token',
	})
	@ApiResponse({
		status: 200,
		description: 'Refresh token accepted and new access token received',
	})
	refresh(@Body() refreshDto: RefreshDto) {
		this.logger.log(`Received POST request /refresh: ${refreshDto}`);
		return this.authService.refresh(refreshDto);
	}

	@Get('me')
	@ApiResponse({
		status: 200,
		description: 'Access token accepted and user data returned',
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	me(@UserDecorator() user: UserFromTokenPayload) {
		this.logger.log(`Received GET request /me: ${user}`);
		return this.authService.me({ userId: user.userId });
	}
}
