import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPatch,
    httpPost,
    request,
} from 'inversify-express-utils';
import { CORE, SERVICE } from '../core/types';
import { Request } from 'express';
import { inject } from 'inversify';
import { TemplateService } from '../service/template';
import Joi from 'joi';
import { getValidated } from '../utils/data-validation';

@controller('/templates')
export class TemplateController extends BaseHttpController {
    constructor(@inject(SERVICE.template) private templateService: TemplateService) {
        super();
    }

    @httpGet('/', CORE.MIDDLEWARES.authenticated)
    async listTemplates(@request() req: Request) {
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

        const templates = await this.templateService.listTemplates({
            take: query.take,
            cursor: query.cursor,
        });

        return this.json(templates, 200);
    }

    /**
     * TODO
     * @param req
     */
    @httpPost('/', CORE.MIDDLEWARES.admin)
    async createTemplate(@request() req: Request) {}

    /**
     * TODO
     * @param req
     */
    @httpPatch('/:templateId', CORE.MIDDLEWARES.admin)
    async updateTemplate(@request() req: Request) {}

    /**
     * TODO
     * @param req
     */
    @httpDelete('/:templateId', CORE.MIDDLEWARES.admin)
    async deleteTemplate(@request() req: Request) {}
}
