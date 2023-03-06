import { Container } from 'inversify';
import { JwtAuthService } from '../service/jwt-auth';
import { CORE, DATA, INFRASTRUCTURE, SERVICE } from './types';
import { AuthService } from '../model/auth-service';
import { BaseMiddleware } from 'inversify-express-utils';
import { AdminMiddleware } from './middlewares/admin';
import { AuthenticatedMiddleware } from './middlewares/authenticated';
import { InstanceService } from '../service/instance';
import { TemplateService } from '../service/template';
import { PrismaClient } from '@prisma/client';
import '../controller/auth';
import '../controller/instance';
import '../controller/template';
import '../controller/user-instance';
import { UserData } from '../data/user';
import { UserService } from '../service/user';
import { InstanceData } from '../data/instance';
import { TemplateData } from '../data/template';
import { EC2Client } from '@aws-sdk/client-ec2';
import { EC2InstanceConnectClient } from '@aws-sdk/client-ec2-instance-connect';

const container = new Container();

/**
 * Core
 */
container.bind<BaseMiddleware>(CORE.MIDDLEWARES.admin).to(AdminMiddleware).inSingletonScope();
container.bind<BaseMiddleware>(CORE.MIDDLEWARES.authenticated).to(AuthenticatedMiddleware).inSingletonScope();

/**
 * Infrastructure layer
 */
container.bind<PrismaClient>(INFRASTRUCTURE.prismaClient).toConstantValue(
    ((): PrismaClient => {
        const prismaClient = new PrismaClient();
        return prismaClient;
    })(),
);
container.bind<EC2Client>(INFRASTRUCTURE.ec2Client).toConstantValue(
    new EC2Client({
        // TODO
    }),
);
container.bind<EC2InstanceConnectClient>(INFRASTRUCTURE.ec2InstanceConnectClient).toConstantValue(
    new EC2InstanceConnectClient({
        // TODO
    }),
);

/**
 * Service layer
 */
container.bind<InstanceService>(SERVICE.instance).to(InstanceService).inSingletonScope();
container.bind<AuthService>(SERVICE.auth).to(JwtAuthService).inSingletonScope();
container.bind<TemplateService>(SERVICE.template).to(TemplateService).inSingletonScope();
container.bind<UserService>(SERVICE.user).to(UserService).inSingletonScope();

/**
 * Data layer
 */
container.bind<InstanceData>(DATA.instance).to(InstanceData).inSingletonScope();
container.bind<TemplateData>(DATA.template).to(TemplateData).inSingletonScope();
container.bind<UserData>(DATA.user).to(UserData).inSingletonScope();

export { container };
