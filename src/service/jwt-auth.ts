import { injectable } from 'inversify';
import { AuthService } from '../model/auth-service';
import { DecodedAuthToken, decodedAuthTokenSchema } from '../model/decoded-auth-token';
import * as jwt from 'jsonwebtoken';
import { getValidated } from '../utils/data-validation';
import axios from 'axios';

@injectable()
export class JwtAuthService implements AuthService {
    async verifyToken(token: string): Promise<DecodedAuthToken> {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'no-secret', {
            algorithms: ['HS256'],
        });

        return await getValidated<DecodedAuthToken>(decodedAuthTokenSchema, payload, {
            abortEarly: true,
            stripUnknown: true,
        });
    }

    async signIn(username: string, password: string): Promise<string> {
        const response = await axios.post<{ token: string }>(
            `https://sistemas2.utfpr.edu.br/utfpr-auth/api/v1`,
            { username, password },
            {
                headers: {
                    Referer:
                        'https://sistemas2.utfpr.edu.br/login?returnUrl=%2Fdpls%2Fsistema%2Faluno01%2Fmpmenu.inicio',
                },
            },
        );

        if (response.data.token === undefined) {
            throw new Error('Forbidden');
        }

        const payload: DecodedAuthToken = {
            id: parseInt(username.slice(1)),
            role: 'USER',
        };

        return jwt.sign(payload, process.env.JWT_SECRET || 'no-secret', {
            algorithm: 'HS256',
            expiresIn: '12h',
        });
    }
}
