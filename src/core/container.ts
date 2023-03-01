import { Container } from 'inversify';
import { JwtAuthService } from '../service/jwt-auth';
import { CORE, SERVICE } from './types';
import { AuthService } from '../model/auth-service';
import { BaseMiddleware } from 'inversify-express-utils';
import { AdminMiddleware } from './middlewares/admin';
import { AuthenticatedMiddleware } from './middlewares/authenticated';
import '../controller/auth';

const container = new Container();

/**
 * Core
 */
container.bind<BaseMiddleware>(CORE.MIDDLEWARES.admin).to(AdminMiddleware).inSingletonScope();
container.bind<BaseMiddleware>(CORE.MIDDLEWARES.authenticated).to(AuthenticatedMiddleware).inSingletonScope();

/**
 * Infrastructure layer
 */

/**
 * Service layer
 */
container.bind<AuthService>(SERVICE.auth).to(JwtAuthService).inSingletonScope();

/**
 * Data layer
 */

export { container };
