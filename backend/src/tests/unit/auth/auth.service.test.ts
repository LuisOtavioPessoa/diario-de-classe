import { describe, it, expect, vi, afterEach } from "vitest";
import { Auth } from "../../../modules/auth/auth.model";
import { setupAuthExists, setupAuthByIdExists } from "../../helpers/setupAuthExists";
import { setupBcryptHash } from "../../helpers/setupAuthMocks";
import { fakeAuth } from "../../mocks/auth";
import { registerService } from "../../../modules/auth/auth.services";
import bcrypt from "bcrypt";

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

    describe("Sucesso", () => {})

    describe("Erros", () => {})

});

describe("refreshTokenService", () => {

    describe("Sucesso", () => {})

    describe("Erros", () => {})

});

describe("logoutService", () => {

    describe("Sucesso", () => {})

});