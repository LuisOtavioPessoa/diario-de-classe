import { describe, it, expect, vi, afterEach } from "vitest";
import { mockRequest, mockResponse } from "../../helpers/http";
import * as studentServices from "../../../modules/students/students.services";
import { create, listByClass } from "../../../modules/students/students.controller";
import { Types } from "mongoose";

const birthDate = new Date("2005-02-25");
const classId = new Types.ObjectId();

afterEach(() => {
    vi.restoreAllMocks();
});

describe("create Controller", () => {

    describe("Sucesso", () => {

        it("deve criar um aluno(a) com sucesso", async () => {

            const req = mockRequest(
                {
                    name: "Luís",
                    birthDate,
                    gender: "male",
                    disability: null,
                    classId,
                },
                {
                    id: "user123",
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "createStudentService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        id: "student123",
                        name: "Luís",
                        birthDate,
                        gender: "male",
                        disability: null,
                        classId,
                    } as any,
                });

            await create(req, res);

            expect(studentServices.createStudentService)
                .toHaveBeenCalledWith(
                    "Luís",
                    birthDate,
                    "male",
                    null,
                    classId,
                    "user123",
                );

            expect(res.status)
                .toHaveBeenCalledWith(201);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Aluno criado com sucesso",
                    data: expect.objectContaining({
                        id: "student123",
                        name: "Luís",
                        birthDate,
                        gender: "male",
                        disability: null,
                        classId,
                    }),
                });
        });

    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async () => {

            const req = mockRequest(
                {
                    name: "Luís",
                    birthDate,
                    gender: "male",
                    disability: null,
                    classId,
                },
                {
                    id: "user123",
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "createStudentService")
                .mockResolvedValue({
                    error: true,
                    status: 409,
                    message: "Aluno já cadastrado",
                });

            await create(req, res);

            expect(studentServices.createStudentService)
                .toHaveBeenCalledWith(
                    "Luís",
                    birthDate,
                    "male",
                    null,
                    classId,
                    "user123",
                );

            expect(res.status)
                .toHaveBeenCalledWith(409);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Aluno já cadastrado",
                });
        });

        it("deve retornar erro interno quando createStudentService lançar exceção", async () => {

            const req = mockRequest(
                {
                    name: "Luís",
                    birthDate,
                    gender: "male",
                    disability: null,
                    classId,
                },
                {
                    id: "user123",
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "createStudentService")
                .mockRejectedValue(new Error("Erro inesperado"));

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await create(req, res);

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

describe("listByClass Controller", () => {

    describe("Sucesso", () => {

        it("deve listar alunos da turma com sucesso", async () => {

            const req = mockRequest(
                {},
                { id: "user123" },
                {
                    classId: "class123",
                },
                {
                    page: "1",
                    limit: "10",
                    search: "Luís",
                    hasDisability: "true",
                    disability: "Autismo",
                    gender: "male",
                    sort: "name",
                    order: "asc",
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "listStudentsByClassService")
                .mockResolvedValue({
                    error: false,
                    data: [
                        {
                            _id: new Types.ObjectId(),
                            name: "Luís",
                            birthDate: new Date("2005-02-25"),
                            gender: "male",
                            disability: "Autismo",
                            classId: new Types.ObjectId(),
                        } as any,
                    ],
                    pagination: {
                        page: 1,
                        limit: 10,
                        total: 1,
                        totalPages: 1,
                    },
                });

            await listByClass(req, res);

            expect(studentServices.listStudentsByClassService)
                .toHaveBeenCalledWith(
                    "class123",
                    "user123",
                    1,
                    10,
                    "Luís",
                    true,
                    "Autismo",
                    "male",
                    "name",
                    "asc",
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    data: expect.any(Array),
                    pagination: {
                        page: 1,
                        limit: 10,
                        total: 1,
                        totalPages: 1,
                    },
                });
        });

    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async () => {

            const req = mockRequest(
                {},
                { id: "user123" },
                {
                    classId: "class123",
                },
                {}
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "listStudentsByClassService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Turma não encontrada",
                });

            await listByClass(req, res);

            expect(studentServices.listStudentsByClassService)
                .toHaveBeenCalledWith(
                    "class123",
                    "user123",
                    NaN,
                    NaN,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                );

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Turma não encontrada",
                });
        });

        it("deve retornar erro interno quando listStudentsByClassService lançar exceção", async () => {

            const req = mockRequest(
                {},
                { id: "user123" },
                {
                    classId: "class123",
                },
                {}
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "listStudentsByClassService")
                .mockRejectedValue(
                    new Error("Erro inesperado")
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await listByClass(req, res);

            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });
        });

    });

});