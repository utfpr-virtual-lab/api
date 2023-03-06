import Joi from 'joi';

export type InstanceCredentials = {
    host: string;
    port: string;
    user: string;
    privateKey: string;
};

export const instanceCredentialsSchema = Joi.object<InstanceCredentials>({
    host: Joi.string().required(),
    port: Joi.string().required(),
    user: Joi.string().required(),
    privateKey: Joi.string().required(),
});
