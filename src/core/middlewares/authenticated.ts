import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

@injectable()
export class AuthenticatedMiddleware extends BaseMiddleware {
    async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const principal = this.httpContext.user;
            const isAuthenticated = await principal.isAuthenticated();

            if (!isAuthenticated) {
                throw new Error('Unauthorized');
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}
