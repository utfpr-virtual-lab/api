import { inject, injectable } from 'inversify';
import { DATA, INFRASTRUCTURE } from '../core/types';
import { InstanceData } from '../data/instance';
import { Paginated } from '../model/paginated';
import { Instance, Prisma, Template } from '@prisma/client';
import { EC2Client, InstanceStateName } from '@aws-sdk/client-ec2';
import { EC2InstanceConnectClient } from '@aws-sdk/client-ec2-instance-connect';
import { InstanceCredentials } from '../model/instance-credentials';

@injectable()
export class InstanceService {
    constructor(
        @inject(INFRASTRUCTURE.ec2Client) private ec2Client: EC2Client,
        @inject(INFRASTRUCTURE.ec2InstanceConnectClient) private ec2InstanceConnectClient: EC2InstanceConnectClient,
        @inject(DATA.instance) private instanceData: InstanceData,
    ) {}

    async listInstances(data: {
        where?: Prisma.InstanceWhereInput;
        take: number;
        cursor?: string;
    }): Promise<Paginated<Instance, string>> {
        return this.instanceData.listInstances(data);
    }

    async countInstances(data: { where?: Prisma.InstanceWhereInput }): Promise<number> {
        return this.instanceData.countInstances(data);
    }

    async getInstanceById(id: string): Promise<Instance> {
        const instance = await this.instanceData.getInstanceById(id);

        if (instance === null) {
            throw new Error('Instance not found');
        }

        return instance;
    }

    /**
     * TODO
     * @param instanceId
     * @returns
     */
    async createInstanceOneTimeCredentials(instanceId: string): Promise<InstanceCredentials> {
        return {
            host: '',
            port: '',
            privateKey: '',
            user: '',
        };
    }

    /**
     * TODO
     * @param id
     * @returns
     */
    async getInstanceState(id: string): Promise<InstanceStateName> {
        return InstanceStateName.running;
    }

    /**
     * TODO: create ec2 instance
     * @param data
     * @returns
     */
    async createInstance(userId: number, template: Template): Promise<Instance> {
        const instance = await this.instanceData.createInstance({
            id: '',
            userId: 1,
        });

        return instance;
    }

    /**
     * TODO:  delete ec2 instance
     * @param id
     */
    async deleteInstance(id: string): Promise<void> {
        return this.instanceData.deleteInstance(id);
    }
}
