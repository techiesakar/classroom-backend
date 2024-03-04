import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from "bcrypt"
import { User } from 'src/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService

  ) { }


  async validateUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new UnauthorizedException()
    }
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid Credential")
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (user && passwordMatch) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }


  async login(user: User, response: Response) {
    const payload = { username: user.email, sub: user.id };
    response.cookie('classroom_token', this.jwtService.sign(payload), {
      sameSite: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 1),
      domain: this.configService.getOrThrow<string>("FRONTEND_HOST") || "localhost"
    })
    return {
      message: "Logged in Successfully"
    }
  }
}