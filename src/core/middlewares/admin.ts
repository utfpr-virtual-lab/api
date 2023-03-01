import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

@injectable()
export class AdminMiddleware extends BaseMiddleware {
    async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const principal = this.httpContext.user;
            const isAuthenticated = await principal.isAuthenticated();
            const isAdmin = await principal.isInRole('admin');

            if (isAuthenticated && isAdmin) {
                next();
            } else {
                throw new Error('Unauthorized');
            }
        } catch (error) {
            next(error);
        }
    }
}
