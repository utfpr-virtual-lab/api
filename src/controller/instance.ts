import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPatch,
    principal,
    request,
    requestParam,
} from 'inversify-express-utils';
import { CORE, SERVICE } from '../core/types';
import { UserPrincipal } from '../core/principals/user';
import { inject } from 'inversify';
import { InstanceService } from '../service/instance';
import Joi from 'joi';
import { getValidated } from '../utils/data-validation';
import { Request } from 'express';

@controller('/instances')
export class InstanceController extends BaseHttpController {
    constructor(@inject(SERVICE.instance) private instanceService: InstanceService) {
        super();
    }

    @httpGet('/', CORE.MIDDLEWARES.admin)
    async listInstances(@request() req: Request) {
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

        const instances = await this.instanceService.listInstances({
            take: query.take,
            cursor: query.cursor,
        });

        return this.json(instances, 200);
    }

    /**
     * TODO
     * @param req
     */
    @httpPatch('/:instanceId', CORE.MIDDLEWARES.admin)
    async updateInstance(@request() req: Request) {}

    @httpDelete('/:instanceId', CORE.MIDDLEWARES.admin)
    async deleteInstance(@requestParam('instanceId') instanceId: string) {
        await this.instanceService.deleteInstance(instanceId);
        return this.ok();
    }
}
