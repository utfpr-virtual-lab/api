import { DecodedAuthToken } from './decoded-auth-token';

type AuthToken = string;

export interface AuthService {
    verifyToken(token: AuthToken): Promise<DecodedAuthToken>;
    signIn(username: string, password: string): Promise<AuthToken>;
}
