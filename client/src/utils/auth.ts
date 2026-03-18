import type { User } from '../model/auth.ts';

export const getToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const getUser = (): User | null => {
    const token = getToken();
    if (!token) return null;
    try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        return {
            cpt_id: payload.cpt_id,
            cpt_pseudo: payload.cpt_pseudo,
            cpt_role: payload.role
        } as User;
    } catch {
        return null;
    }
};

export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.cpt_role === 'A';
};

export const logout = (): void => {
    localStorage.removeItem('token');
};