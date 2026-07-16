import { describe, it, expect, vi, afterEach } from "vitest";
import { login, logout, refresh, register } from "../../../modules/auth/auth.controller";
import * as authServices from "../../../modules/auth/auth.services";
import { mockRequest, mockResponse } from "../../helpers/http";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("register Controller", () => {

    describe("Sucesso", () => {

        it("deve registrar um usuário com sucesso", async() => {

            const req = mockRequest({
                name: "Luís",
                email: "luis@email.com",
                password: "123456",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "registerService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        id: "user123",
                        name: "Luís",
                        email: "luis@email.com",
                    },
                });

            await register(req, res);

            expect(authServices.registerService)
                .toHaveBeenCalledWith(
                    "Luís",
                    "luis@email.com",
                    "123456",
                );

            expect(res.status)
                .toHaveBeenCalledWith(201);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Auth criado com sucesso",
                    data: {
                        id: "user123",
                        name: "Luís",
                        email: "luis@email.com"
                    },
                });
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async() => {

            const req = mockRequest({
                name: "Luís",
                email: "luis@email.com",
                password: "123456",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "registerService")
                .mockResolvedValue({
                    error: true,
                    status: 409,
                    message: "Email já cadastrado",
                });

            await register(req, res);

            expect(authServices.registerService)
                .toHaveBeenCalledWith(
                    "Luís",
                    "luis@email.com",
                    "123456",
                );

            expect(res.status)
                .toHaveBeenCalledWith(409);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Email já cadastrado",
                });
        });

        it("deve retornar erro interno quando registerService lançar exceção", async() => {

            const req = mockRequest({
                name: "Luís",
                email: "luis@email.com",
                password: "123456",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "registerService")
                .mockRejectedValue(new Error("Erro inesperado"));

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await register(req, res);

            expect(consoleSpy).toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });
        });
    });
});

describe("login Controller", () => {
    
    describe("Sucesso", () => {

        it("deve realizar login com sucesso", async() => {
           
            const req = mockRequest({
                email: "luis@email.com",
                password: "123456",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "loginService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        accessToken: "fake-access-token",
                        refreshToken: "fake-refresh-token",
                        user: {
                            id: "user123",
                            name: "Luís",
                            email: "luis@email.com",
                        },
                    },
                });

            await login(req, res);

            expect(authServices.loginService)
                .toHaveBeenCalledWith(
                    "luis@email.com",
                    "123456",
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Login realizado com sucesso",
                    accessToken: "fake-access-token",
                    refreshToken: "fake-refresh-token",
                    user: {
                        id: "user123",
                        name: "Luís",
                        email: "luis@email.com",
                    },
                });
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async() => {

            const req = mockRequest({
                email: "luis@email.com",
                password: "123456",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "loginService")
                .mockResolvedValue({
                    error: true,
                    status: 401,
                    message: "Email ou senha inválidos",
                });

            await login(req, res);

            expect(authServices.loginService)
                .toHaveBeenCalledWith(
                    "luis@email.com",
                    "123456",
                );

            expect(res.status)
                .toHaveBeenCalledWith(401);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Email ou senha inválidos",
                });
        });

        it("deve retornar erro interno quando loginService lançar exceção", async () => {

            const req = mockRequest({
                email: "luis@email.com",
                password: "123456",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "loginService")
                .mockRejectedValue(new Error("Erro inesperado"));

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await login(req, res);

            expect(consoleSpy).toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });
        });
    });
});

describe("refresh Controller", () => {
    
    describe("Sucesso", () => {

        it("deve realizar refresh com sucesso", async() => {
           
            const req = mockRequest({
                refreshToken: "fake-refresh-token"
            });

            const res = mockResponse();

            vi.spyOn(authServices, "refreshTokenService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        accessToken: "fake-access-token",
                    },
                });

            await refresh(req, res);

            expect(authServices.refreshTokenService)
                .toHaveBeenCalledWith(
                    "fake-refresh-token",
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    accessToken: "fake-access-token",
                });
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async () => {

            const req = mockRequest({
                refreshToken: "fake-refresh-token",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "refreshTokenService")
                .mockResolvedValue({
                    error: true,
                    status: 401,
                    message: "Refresh token inválido",
                });

            await refresh(req, res);

            expect(authServices.refreshTokenService)
                .toHaveBeenCalledWith(
                    "fake-refresh-token",
                );

            expect(res.status)
                .toHaveBeenCalledWith(401);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Refresh token inválido",
                });

        });

        it("deve retornar erro interno quando loginService lançar exceção", async () => {

            const req = mockRequest({
                refreshToken: "fake-refresh-token"
            });

            const res = mockResponse();

            vi.spyOn(authServices, "refreshTokenService")
                .mockRejectedValue(new Error("Erro inesperado"));

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await refresh(req, res);

            expect(consoleSpy).toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });
        });
    });
});

describe("logout Controller", () => {

    describe("Sucesso", () => {

        it("deve realizar logout com sucesso", async () => {

            const req = mockRequest({
                refreshToken: "fake-refresh-token",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "logoutService")
                .mockResolvedValue({
                    error: false,
                    data: undefined,
                });

            await logout(req, res);

            expect(authServices.logoutService)
                .toHaveBeenCalledWith(
                    "fake-refresh-token",
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Logout realizado com sucesso",
                });

        });

    });

    describe("Erros", () => {

        it("deve retornar erro interno quando logoutService lançar exceção", async () => {

            const req = mockRequest({
                refreshToken: "fake-refresh-token",
            });

            const res = mockResponse();

            vi.spyOn(authServices, "logoutService")
                .mockRejectedValue(new Error("Erro inesperado"));

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await logout(req, res);

            expect(consoleSpy).toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });

        });

    });

});