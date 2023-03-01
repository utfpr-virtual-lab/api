import { injectable } from 'inversify';
import { AuthService } from '../model/auth-service';
import { DecodedAuthToken, decodedAuthTokenSchema } from '../model/decoded-auth-token';
import * as jwt from 'jsonwebtoken';
import { getValidated } from '../utils/data-validation';

@injectable()
export class JwtAuthService implements AuthService {
    async verifyToken(token: string): Promise<DecodedAuthToken> {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'no-secret', { algorithms: ['HS256'] });

        return await getValidated<DecodedAuthToken>(decodedAuthTokenSchema, payload, {
            abortEarly: true,
            stripUnknown: true,
        });
    }

    async signIn(username: string, password: string): Promise<string> {
        /**
         * Add logic that communicates to UTFPR
         */

        const payload: DecodedAuthToken = {
            id: `${username}_-_${password}`,
            role: 'user',
        };

        return jwt.sign(payload, process.env.JWT_SECRET || 'no-secret', {
            algorithm: 'HS256',
            expiresIn: '12h',
        });
    }
}
