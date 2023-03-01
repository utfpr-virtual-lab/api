import Joi from 'joi';

export type DecodedAuthToken = {
    id: string;
    role: 'user' | 'admin';
};

export const decodedAuthTokenSchema = Joi.object({
    id: Joi.string().required(),
    role: Joi.string().valid('user', 'admin'),
})
    .unknown(true)
    .required();
