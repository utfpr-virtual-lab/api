import { inject, injectable } from 'inversify';
import { DATA } from '../core/types';
import { TemplateData } from '../data/template';
import { Prisma, Template } from '@prisma/client';

@injectable()
export class TemplateService {
    constructor(@inject(DATA.template) private templateData: TemplateData) {}

    async listTemplates(data: { where?: Prisma.TemplateWhereInput; take: number; cursor?: string }) {
        return this.templateData.listTemplates(data);
    }

    async getTemplateById(id: string): Promise<Template> {
        const template = await this.templateData.getTemplateById(id);

        if (template === null) {
            throw new Error('Template not found');
        }

        return template;
    }
}
