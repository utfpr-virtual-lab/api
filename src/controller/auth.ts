import { BaseHttpController, controller, httpPost, request } from 'inversify-express-utils';
import { getValidated } from '../utils/data-validation';
import Joi from 'joi';
import { Request } from 'express';
import { inject } from 'inversify';
import { SERVICE } from '../core/types';
import { AuthService } from '../model/auth-service';

@controller('/auth')
export class AuthController extends BaseHttpController {
    constructor(@inject(SERVICE.auth) private authService: AuthService) {
        super();
    }

    @httpPost('/signin')
    async signIn(@request() req: Request) {
        type Payload = {
            username: string;
            password: string;
        };

        const schema = Joi.object<Payload>({
            username: Joi.string().required(),
            password: Joi.string().required(),
        })
            .unknown(false)
            .required();

        const { username, password } = await getValidated<Payload>(schema, req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        const token = await this.authService.signIn(username, password);
        return this.json({ token }, 200);
    }
}
