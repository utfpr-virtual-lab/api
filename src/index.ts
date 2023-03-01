import '@abraham/reflection';
import { container } from './core/container';
import { InversifyExpressServer, RoutingConfig } from 'inversify-express-utils';
import { AuthProvider } from './core/auth-provider';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';

const routingConfig: RoutingConfig = {
    rootPath: '/api',
};

const server = new InversifyExpressServer(container, null, routingConfig, null, AuthProvider);

server.setConfig((app) => {
    app.use(helmet());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
});

server.setErrorConfig((app) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404).end('error');
    });

    app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
        const message = err instanceof Error ? err.message : 'Unknown';
        console.log(`Error: ${message}`);
        res.status(500).send(message);
    });
});

const app = server.build();
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
