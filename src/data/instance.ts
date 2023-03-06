import { Instance, Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE } from '../core/types';
import { Paginated } from '../model/paginated';

@injectable()
export class InstanceData {
    constructor(@inject(INFRASTRUCTURE.prismaClient) private prismaClient: PrismaClient) {}

    async listInstances(data: {
        where?: Prisma.InstanceWhereInput;
        take: number;
        cursor?: string;
    }): Promise<Paginated<Instance, string>> {
        const skip = data.cursor !== undefined ? 1 : 0;
        const cursor: Prisma.InstanceWhereUniqueInput | undefined =
            data.cursor !== undefined ? { id: data.cursor } : undefined;

        const instances = await this.prismaClient.instance.findMany({
            take: data.take,
            skip,
            cursor,
            where: data.where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            data: instances,
            cursor: instances.length === 0 ? null : instances[instances.length - 1].id,
        };
    }

    async countInstances(data: { where?: Prisma.InstanceWhereInput }): Promise<number> {
        const count = await this.prismaClient.instance.count({
            where: data.where,
        });

        return count;
    }

    async createInstance(data: Prisma.InstanceUncheckedCreateInput): Promise<Instance> {
        const instance = await this.prismaClient.instance.create({ data });
        return instance;
    }

    async getInstanceById(id: string): Promise<Instance | null> {
        const instance = await this.prismaClient.instance.findUnique({
            where: {
                id,
            },
        });

        return instance;
    }

    async deleteInstance(id: string): Promise<void> {
        await this.prismaClient.instance.delete({
            where: {
                id,
            },
        });
    }
}
