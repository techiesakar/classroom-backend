import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        });
    }


    async validate(payload: any) {
        request.user = {
            email: payload.username,
            id: payload.sub
        }
        return { userId: payload.sub, username: payload.username };
    }

    private static extractJWT(req: typeof request): string | null {
        if (req.cookies && 'classroom_token' in req.cookies && req.cookies.classroom_token.length > 0) {
            return req.cookies.classroom_token
        }
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer')) {
            return authHeader.substring(7)
        }

        return null
    }


}
