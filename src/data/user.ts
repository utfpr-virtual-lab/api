import { Instance, Prisma, PrismaClient, User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { Paginated } from '../model/paginated';
import { INFRASTRUCTURE } from '../core/types';

@injectable()
export class UserData {
    constructor(@inject(INFRASTRUCTURE.prismaClient) private prismaClient: PrismaClient) {}

    async listUsers(data: {
        where?: Prisma.UserWhereInput;
        take: number;
        cursor?: number;
    }): Promise<Paginated<User, number>> {
        const skip = data.cursor !== undefined ? 1 : 0;
        const cursor: Prisma.UserWhereUniqueInput | undefined =
            data.cursor !== undefined ? { id: data.cursor } : undefined;

        const users = await this.prismaClient.user.findMany({
            take: data.take,
            skip,
            cursor,
            where: data.where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            data: users,
            cursor: users.length === 0 ? null : users[users.length - 1].id,
        };
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id,
            },
        });

        return user;
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const user = await this.prismaClient.user.create({
            data,
        });

        return user;
    }

    async updateUser(
        id: number,
        data: Pick<Prisma.UserUncheckedUpdateWithoutInstancesInput, 'role' | 'maxInstances'>,
    ): Promise<User> {
        const user = await this.prismaClient.user.update({
            where: {
                id,
            },
            data,
        });

        return user;
    }
}
