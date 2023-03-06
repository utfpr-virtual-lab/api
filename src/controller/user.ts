import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPatch,
    httpPost,
    principal,
    request,
    requestParam,
} from 'inversify-express-utils';
import { CORE, SERVICE } from '../core/types';
import { UserPrincipal } from '../core/principals/user';
import { inject } from 'inversify';
import { UserService } from '../service/user';
import Joi from 'joi';
import { Request } from 'express';
import { getValidated } from '../utils/data-validation';
import { AccessRole, Prisma } from '@prisma/client';

@controller('/users')
export class UserController extends BaseHttpController {
    constructor(@inject(SERVICE.user) private userService: UserService) {
        super();
    }

    @httpGet('/', CORE.MIDDLEWARES.admin)
    async listUsers(@request() req: Request) {
        type QueryPayload = {
            take: number;
            cursor?: number;
        };

        const queryPayloadSchema = Joi.object<QueryPayload>({
            take: Joi.number().min(1).max(100).required(),
            cursor: Joi.number().optional(),
        }).required();

        const query = await getValidated<QueryPayload>(queryPayloadSchema, req.query, {
            abortEarly: true,
            stripUnknown: true,
        });

        const users = await this.userService.listUsers({
            take: query.take,
            cursor: query.cursor,
        });

        return this.json(users, 200);
    }

    @httpPatch('/:userId', CORE.MIDDLEWARES.admin)
    async updateUser(@requestParam('userId') userId: string, @request() req: Request) {
        type BodyPayload = Pick<Prisma.UserUncheckedUpdateWithoutInstancesInput, 'role' | 'maxInstances'>;

        const bodyPayloadSchema = Joi.object<BodyPayload>({
            maxInstances: Joi.number().min(0).max(30),
            role: Joi.string().valid(...Object.values(AccessRole)),
        }).required();

        const body = await getValidated<BodyPayload>(bodyPayloadSchema, req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        const numericUserId: number = parseInt(userId);

        if (Number.isNaN(numericUserId)) {
            throw new Error('Invalid user id');
        }

        const user = await this.userService.updateUser(numericUserId, body);
        return this.json(user, 200);
    }

    @httpGet('/:userId', CORE.MIDDLEWARES.authenticated)
    async getUserById(@principal() principal: UserPrincipal) {
        const userId = principal.details.id;
        const user = await this.userService.getUserById(userId);
        return this.json(user, 200);
    }

    @httpGet('/:userId/instances', CORE.MIDDLEWARES.authenticated)
    async listUserInstances(@request() req: Request, @principal() principal: UserPrincipal) {
        type QueryPayload = {
            take: number;
            cursor?: string;
        };

        const queryPayloadSchema = Joi.object<QueryPayload>({
            take: Joi.number().min(1).max(100).required(),
            cursor: Joi.string().optional(),
        }).required();

        const query = await getValidated<QueryPayload>(queryPayloadSchema, req.query, {
            abortEarly: true,
            stripUnknown: true,
        });

        const userId = principal.details.id;

        const instances = await this.userService.listUserInstances(userId, {
            take: query.take,
            cursor: query.cursor,
        });

        return this.json(instances, 200);
    }

    @httpGet('/:userId/instances/:instanceId/credentials', CORE.MIDDLEWARES.authenticated)
    async getUserInstanceCredentials(
        @requestParam('instanceId') instanceId: string,
        @principal() principal: UserPrincipal,
    ) {
        const userId = principal.details.id;
        const credentials = await this.userService.getUserInstanceCredentials(userId, instanceId);
        return this.json(credentials, 200);
    }

    @httpGet('/:userId/instances/:instanceId/state', CORE.MIDDLEWARES.authenticated)
    async getUserInstanceState(@requestParam('instanceId') instanceId: string, @principal() principal: UserPrincipal) {
        const userId = principal.details.id;
        const state = await this.userService.getUserInstanceState(userId, instanceId);
        return this.json({ state }, 200);
    }

    @httpPost('/:userId/instances', CORE.MIDDLEWARES.authenticated)
    async createUserInstance(@request() req: Request, @principal() principal: UserPrincipal) {
        const userId = principal.details.id;

        type BodyPayload = {
            templateId: string;
        };

        const bodyPayloadSchema = Joi.object<BodyPayload>({
            templateId: Joi.string().required(),
        }).required();

        const body = await getValidated<BodyPayload>(bodyPayloadSchema, req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        const instanceId = await this.userService.createUserInstance(userId, body.templateId);
        return this.created(instanceId, instanceId);
    }

    @httpDelete('/:userId/instances/:instanceId', CORE.MIDDLEWARES.authenticated)
    async deleteUserInstance(@requestParam('instanceId') instanceId: string, @principal() principal: UserPrincipal) {
        const userId = principal.details.id;
        await this.userService.deleteUserInstance(userId, instanceId);
        return this.ok();
    }
}
