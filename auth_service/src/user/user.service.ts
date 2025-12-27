import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // REGISTER USER AND RETURN ACCESS TOKEN WITH USER DATA
  async register(userData: Partial<User>): Promise<any> {
    if (!userData.password) {
      throw new Error('Password is required');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Prepare user data
    const userDataToSave: DeepPartial<User> = {
      ...userData,
      password: hashedPassword,
    };

    // Save user in the database
    const user = this.userRepository.create(userDataToSave);
    await this.userRepository.save(user);

    // Generate JWT including all user data (except password)
    const { password, ...payload } = user; // remove password from payload
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Return user info + token
    return {
      message: 'User registered successfully',
      user: payload,       // all user data except password
      accessToken,
    };
  }

  // LOGIN USER
  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    // Generate JWT including all user data except password
    const { password: pwd, ...payload } = user;
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      user: payload,
      accessToken,
    };
  }
}
