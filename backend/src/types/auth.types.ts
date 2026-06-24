export interface AuthPayload {
    id: string;
}

export interface RegisterResponse {
    id: string;
    name: string;
    email: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    
    user: {
        id: string;
        name: string;
        email: string;
    };
}