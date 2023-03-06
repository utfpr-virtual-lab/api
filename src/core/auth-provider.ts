import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { interfaces, Principal } from 'inversify-express-utils';
import { SERVICE } from './types';
import { AuthService } from '../model/auth-service';
import { AnonymousPrincipal } from './principals/anonymous';
import { UserPrincipal } from './principals/user';

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
    @inject(SERVICE.auth) private authService!: AuthService;

    async getUser(request: Request, response: Response, next: NextFunction): Promise<Principal> {
        try {
            const authorizationHeader = request.headers.authorization;

            if (authorizationHeader === undefined) {
                return new AnonymousPrincipal();
            }

            if (authorizationHeader.startsWith('Bearer ')) {
                const token = authorizationHeader.slice(7);
                const decodedAuthToken = await this.authService.verifyToken(token);
                return new UserPrincipal(decodedAuthToken);
            }

            return new AnonymousPrincipal();
        } catch {
            return new AnonymousPrincipal();
        }
    }
}
