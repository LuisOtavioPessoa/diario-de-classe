import { Request, Response } from "express";
import { vi } from "vitest";

export const mockRequest = (
    body = {},
    params = {},
    query = {},
) =>
    ({
        body,
        params,
        query,
    } as Request);

export const mockResponse = () => {

    const res = {} as Response;

    res.status = vi.fn().mockReturnValue(res);

    res.json = vi.fn().mockReturnValue(res);

    return res;
};

