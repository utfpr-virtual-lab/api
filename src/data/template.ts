import { Prisma, PrismaClient, Template, User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE } from '../core/types';
import { Paginated } from '../model/paginated';

@injectable()
export class TemplateData {
    constructor(@inject(INFRASTRUCTURE.prismaClient) private prismaClient: PrismaClient) {}

    async listTemplates(data: {
        where?: Prisma.TemplateWhereInput;
        take: number;
        cursor?: string;
    }): Promise<Paginated<Template, string>> {
        const skip = data.cursor !== undefined ? 1 : 0;
        const cursor: Prisma.TemplateWhereUniqueInput | undefined =
            data.cursor !== undefined ? { id: data.cursor } : undefined;

        const templates = await this.prismaClient.template.findMany({
            take: data.take,
            skip,
            cursor,
            where: data.where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            data: templates,
            cursor: templates.length === 0 ? null : templates[templates.length - 1].id,
        };
    }

    async getTemplateById(id: string): Promise<Template | null> {
        const template = await this.prismaClient.template.findUnique({
            where: {
                id,
            },
        });
        return template;
    }
}
