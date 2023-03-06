import { Instance, Prisma, User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { Paginated } from '../model/paginated';
import { DATA, SERVICE } from '../core/types';
import { UserData } from '../data/user';
import { InstanceCredentials } from '../model/instance-credentials';
import { InstanceStateName } from '@aws-sdk/client-ec2';
import { InstanceService } from './instance';
import { TemplateService } from './template';

@injectable()
export class UserService {
    constructor(
        @inject(SERVICE.instance) private instanceService: InstanceService,
        @inject(SERVICE.template) private templateService: TemplateService,
        @inject(DATA.user) private userData: UserData,
    ) {}

    async listUsers(data: {
        where?: Prisma.UserWhereInput;
        take: number;
        cursor?: number;
    }): Promise<Paginated<User, number>> {
        return this.userData.listUsers(data);
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userData.getUserById(id);

        if (user === null) {
            return await this.userData.createUser({
                id,
                role: 'USER',
                maxInstances: 1,
            });
        }

        return user;
    }

    async updateUser(
        id: number,
        data: Pick<Prisma.UserUncheckedUpdateWithoutInstancesInput, 'role' | 'maxInstances'>,
    ): Promise<User> {
        return this.userData.updateUser(id, data);
    }

    async listUserInstances(
        userId: number,
        data: { take: number; cursor?: string },
    ): Promise<Paginated<Instance, string>> {
        const user = await this.getUserById(userId);
        const instances = await this.instanceService.listInstances({
            ...data,
            where: {
                userId: user.id,
            },
        });
        return instances;
    }

    async createUserInstance(userId: number, templateId: string): Promise<string> {
        const user = await this.getUserById(userId);
        const numberOfInstances = await this.instanceService.countInstances({
            where: {
                userId: user.id,
            },
        });

        if (numberOfInstances >= user.maxInstances) {
            throw new Error('Maximum number of instances reached');
        }

        const template = await this.templateService.getTemplateById(templateId);
        const instance = await this.instanceService.createInstance(user.id, template);
        return instance.id;
    }

    async getUserInstanceCredentials(userId: number, instanceId: string): Promise<InstanceCredentials> {
        const instance = await this.instanceService.getInstanceById(instanceId);

        if (userId !== instance.userId) {
            throw new Error('Forbidden: User has not access to instance');
        }

        const credentials = await this.instanceService.createInstanceOneTimeCredentials(instance.id);
        return credentials;
    }

    async getUserInstanceState(userId: number, instanceId: string): Promise<InstanceStateName> {
        const instance = await this.instanceService.getInstanceById(instanceId);

        if (userId !== instance.userId) {
            throw new Error('Forbidden: User has not access to instance');
        }

        const instanceState = await this.instanceService.getInstanceState(instanceId);
        return instanceState;
    }

    async deleteUserInstance(userId: number, instanceId: string): Promise<void> {
        const instance = await this.instanceService.getInstanceById(instanceId);

        if (userId !== instance.userId) {
            throw new Error('Forbidden: User has not access to instance');
        }

        await this.instanceService.deleteInstance(instanceId);
    }
}
