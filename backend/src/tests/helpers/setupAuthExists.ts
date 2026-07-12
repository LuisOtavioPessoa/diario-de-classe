import { vi } from "vitest";
import { Auth } from "../../modules/auth/auth.model";

export const setupAuthExists = (auth: any = {}) => {

    vi.spyOn(Auth, "findOne")
        .mockResolvedValue(auth);

};

export const setupAuthByIdExists = (auth: any = {}) => {

    vi.spyOn(Auth, "findById")
        .mockResolvedValue(auth);

};