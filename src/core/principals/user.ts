import { Principal } from 'inversify-express-utils';
import { DecodedAuthToken } from '../../model/decoded-auth-token';
import { AccessRole } from '@prisma/client';

export class UserPrincipal implements Principal {
    details: DecodedAuthToken;

    constructor(details: DecodedAuthToken) {
        this.details = details;
    }

    async isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }

    async isInRole(role: keyof typeof AccessRole): Promise<boolean> {
        return Promise.resolve(role === this.details.role);
    }

    async isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(true);
    }
}
