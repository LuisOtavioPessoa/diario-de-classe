import { vi } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const setupJwtSign = (
    accessToken = "fake-access-token",
    refreshToken = "fake-refresh-token",
) => {

    return vi.spyOn(jwt, "sign")
        .mockReturnValueOnce(accessToken as any)
        .mockReturnValueOnce(refreshToken as any);

};

export const setupJwtVerify = (
    payload = { id: "user123" },
) => {

    return vi.spyOn(jwt, "verify")
        .mockReturnValue(payload as any);

};

export const setupBcryptHash = (
    hash = "hashed-password",
) => {

    return vi.spyOn(bcrypt, "hash")
        .mockResolvedValue(hash as never);

};

export const setupBcryptCompare = (
    match = true,
) => {

    return vi.spyOn(bcrypt, "compare")
        .mockResolvedValue(match as never);

};