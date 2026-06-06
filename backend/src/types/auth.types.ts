export interface AuthPayload {
    id: string;
}

export interface RegisterResponse {
    id: string;
    name: string;
    email: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}