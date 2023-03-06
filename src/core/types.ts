export const CORE = {
    MIDDLEWARES: {
        admin: Symbol.for('admin'),
        authenticated: Symbol.for('authenticated'),
    },
};

export const INFRASTRUCTURE = {
    prismaClient: Symbol.for('prismaClient'),
    ec2Client: Symbol.for('ec2Client'),
    ec2InstanceConnectClient: Symbol.for('ec2InstanceConnectClient'),
};

export const SERVICE = {
    instance: Symbol.for('instance'),
    auth: Symbol.for('auth'),
    template: Symbol.for('template'),
    user: Symbol.for('user'),
};

export const DATA = {
    instance: Symbol.for('instance'),
    template: Symbol.for('template'),
    user: Symbol.for('user'),
};
