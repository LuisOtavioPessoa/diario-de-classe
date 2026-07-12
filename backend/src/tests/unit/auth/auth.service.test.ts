import { describe, it, expect, vi, afterEach } from "vitest";
import { Auth } from "../../../modules/auth/auth.model";
import { setupAuthExists, setupAuthByIdExists } from "../../helpers/setupAuthExists";
import { setupBcryptCompare, setupBcryptHash, setupJwtSign, setupJwtVerify } from "../../helpers/setupAuthMocks";
import { fakeAuth, fakeAuthWithRefreshToken } from "../../mocks/auth";
import { loginService, registerService } from "../../../modules/auth/auth.services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authConfig } from "../../../config/auth";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("registerService", () => {

    describe("Sucesso", () => {

        it("deve registrar um usuário com sucesso", async() => {

            setupAuthExists(null);

            setupBcryptHash();

            vi.spyOn(Auth, "create")
                .mockResolvedValue(fakeAuth() as any);

            const result = await registerService(
                "Luís",
                "luis@email.com",
                "123456",
            );

            expect(result.error).toBe(false);

            expect(Auth.findOne).toHaveBeenCalledWith({
                email: "luis@email.com",
            });

            expect(bcrypt.hash).toHaveBeenCalledWith(
                "123456",
                10,
            );
            
            expect(Auth.create).toHaveBeenCalledWith({
                name: "Luís",
                email: "luis@email.com",
                password: "hashed-password",
            });

            if (!result.error) {
                expect(result.data).toEqual({
                    id: "user123",
                    name: "Luís",
                    email: "luis@email.com",
                });
            }
        });
    });

    describe("Erros", () => {
                
        it("deve retornar erro quando o email já estiver cadastrado", async() => {

            setupAuthExists(fakeAuth());

            const result = await registerService(
                "Luís",
                "luis@email.com",
                "123456",
            ); 
            
            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(409);
                expect(result.message).toBe("Email já cadastrado");
            }
        });

        it("não deve criptografar a senha quando o email já existir", async() => {

            setupAuthExists(fakeAuth());

            const hashSpy = vi.spyOn(bcrypt, "hash");

            const result = await registerService(
                "Luís",
                "luis@email.com",
                "123456",
            ); 

            expect(hashSpy).not.toHaveBeenCalled();
            expect(Auth.create).not.toHaveBeenCalled();
            
            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(409);
                expect(result.message).toBe("Email já cadastrado");
            }
        });

        it("não deve criar usuário quando o email já existir", async() => {

            setupAuthExists(fakeAuth());

            const createSpy = vi.spyOn(Auth, "create");

            const result = await registerService(
                "Luís",
                "luis@email.com",
                "123456",
            ); 

            expect(createSpy).not.toHaveBeenCalled();
            
            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(409);
                expect(result.message).toBe("Email já cadastrado");
            }
        });
    })

});

describe("loginService", () => {

    describe("Sucesso", () => {
        
        it("deve realizar login com sucesso", async () => {

            const fakeUser = fakeAuthWithRefreshToken();

            setupAuthExists(fakeUser);

            setupBcryptCompare(true);

            setupJwtSign();

            const result = await loginService(
                "luis@email.com",
                "123456",
            );

            expect(Auth.findOne).toHaveBeenCalledWith({
                email: "luis@email.com",
            });

            expect(bcrypt.compare).toHaveBeenCalledWith(
                "123456",
                "hashed-password",
            );

            expect(jwt.sign).toHaveBeenNthCalledWith(
                1,
                {
                    id: "user123",
                },
                authConfig.accessSecret,
                {
                    expiresIn: authConfig.accessExpiresIn,
                },
            );

            expect(jwt.sign).toHaveBeenNthCalledWith(
                2,
                {
                    id: "user123",
                },
                authConfig.refreshSecret,
                {
                    expiresIn: authConfig.refreshExpiresIn,
                },
            );

            expect(fakeUser.save).toHaveBeenCalled();

            expect(result.error).toBe(false);

            if (!result.error) {
                expect(result.data).toEqual({
                    accessToken: "fake-access-token",
                    refreshToken: "fake-refresh-token",

                    user: {
                        id: "user123",
                        name: "Luís",
                        email: "luis@email.com",
                    },
                });
            }
        });
    })

    describe("Erros", () => {

        it("deve retornar erro quando o email não existir", async () => {

            setupAuthExists(null);

            const result = await loginService(
                "luis@email.com",
                "123456",
            );

            expect(Auth.findOne).toHaveBeenCalledWith({
                email: "luis@email.com",
            });

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(401);
                expect(result.message).toBe(
                    "Email ou senha inválidos",
                );
            }
        });

        it("não deve comparar senha quando o usuário não existir", async () => {

            setupAuthExists(null);

            const compareSpy = vi.spyOn(bcrypt, "compare");

            const result = await loginService(
                "luis@email.com",
                "123456",
            );

            expect(compareSpy).not.toHaveBeenCalled();

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(401);
                expect(result.message).toBe(
                    "Email ou senha inválidos",
                );
            }           
        });

        it("não deve gerar tokens quando o usuário não existir", async () => {

            setupAuthExists(null);

            const signSpy = vi.spyOn(jwt, "sign");

            const result = await loginService(
                "luis@email.com",
                "123456",
            );

            expect(signSpy).not.toHaveBeenCalled();

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(401);
                expect(result.message).toBe(
                    "Email ou senha inválidos",
                );
            }
        });

        it("não deve salvar refreshToken quando o usuário não existir", async () => {

            const fakeUser = fakeAuthWithRefreshToken();

            setupAuthExists(null);

            await loginService(
                "luis@email.com",
                "123456",
            );

            expect(fakeUser.save).not.toHaveBeenCalled();

        });

        it("deve retornar erro quando a senha estiver incorreta", async () => {

            const fakeUser = fakeAuthWithRefreshToken();

            setupAuthExists(fakeUser);

            setupBcryptCompare(false);

            const result = await loginService(
                "luis@email.com",
                "123456",
            );

            expect(bcrypt.compare).toHaveBeenCalledWith(
                "123456",
                "hashed-password",
            );

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(401);
                expect(result.message).toBe(
                    "Email ou senha inválidos",
                );
            }
        });

        it("não deve gerar tokens quando a senha estiver incorreta", async () => {

            const fakeUser = fakeAuthWithRefreshToken();

            setupAuthExists(fakeUser);

            setupBcryptCompare(false);

            const signSpy = vi.spyOn(jwt, "sign");

            const result = await loginService(
                "luis@email.com",
                "123456",
            );

            expect(bcrypt.compare).toHaveBeenCalledWith(
                "123456",
                "hashed-password",
            );

            expect(signSpy).not.toHaveBeenCalled();

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(401);
                expect(result.message).toBe(
                    "Email ou senha inválidos",
                );
            }
        });

        it("não deve salvar refreshToken quando a senha estiver incorreta", async () => {

            const fakeUser = fakeAuthWithRefreshToken();

            setupAuthExists(fakeUser);

            setupBcryptCompare(false);

            const result = await loginService(
                "luis@email.com",
                "123456",
            );

            expect(fakeUser.save).not.toHaveBeenCalled();

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(401);
                expect(result.message).toBe(
                    "Email ou senha inválidos",
                );
            }  
        });
    })

});

describe("refreshTokenService", () => {

    describe("Sucesso", () => {})

    describe("Erros", () => {})

});

describe("logoutService", () => {

    describe("Sucesso", () => {})

});