import { AccessRole } from '@prisma/client';
import Joi from 'joi';

export type DecodedAuthToken = {
    id: number;
    role: keyof typeof AccessRole;
};

export const decodedAuthTokenSchema = Joi.object<DecodedAuthToken>({
    id: Joi.number().required(),
    role: Joi.string()
        .valid(...Object.values(AccessRole))
        .required(),
}).required();
