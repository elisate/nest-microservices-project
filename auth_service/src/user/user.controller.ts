import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() userData: Partial<User>) {
    const result = await this.userService.register(userData);

    // Customize the message
    return {
      message: 'Registration successful!',
      user: result.user,
      accessToken: result.accessToken
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.userService.login(body.email, body.password);

    // Customize the message
    return {
      message: 'Login successful!',
      user: result.user,
      accessToken: result.accessToken
    };
  }
}
