import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth.login.dto';
import { UserService } from './user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({
        summary: 'Login User',
    })
    @ApiBody({ type: AuthLoginDto })
    @Post()
    create(@Body() authLoginDto: AuthLoginDto) {
        return this.userService.login(authLoginDto);
    }

}
