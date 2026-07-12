import { vi } from "vitest";

export const fakeAuth = () => ({
    _id: "user123",
    name: "Luís",
    email: "luis@email.com",
    password: "hashed-password",
    refreshToken: null,
    save: vi.fn(),
});

export const fakeAuthWithRefreshToken = () => ({
    _id: "user123",
    name: "Luís",
    email: "luis@email.com",
    password: "hashed-password",
    refreshToken: "refresh-token",
    save: vi.fn(),
});