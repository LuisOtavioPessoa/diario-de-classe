import { describe, it, expect, vi, afterEach } from "vitest";
import { mockRequest, mockResponse } from "../../helpers/http";
import * as studentServices from "../../../modules/students/students.services";
import { create, deleteStudentById, listByClass, listById, updateStudent } from "../../../modules/students/students.controller";
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
                {},              // params
                {},              // query
                { id: "user123"} // user
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
                {},              // params
                {},              // query
                { id: "user123"} // user
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
                },

                {
                    id: "user123",
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

                // params
                {
                    classId: "class123",
                },

                // query
                {},

                // user
                {
                    id: "user123",
                }
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

            expect(res.status).toHaveBeenCalledWith(404);

            expect(res.json).toHaveBeenCalledWith({
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

describe("listById Controller", () => {

    describe("Sucesso", () => {

        it("deve listar um aluno pelo id com sucesso", async () => {

            const studentId = new Types.ObjectId();
            const classId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "getStudentByIdService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        _id: studentId,
                        name: "Luís",
                        birthDate: birthDate,
                        gender: "male",
                        disability: null,
                        classId,
                    } as any,
                });

            await listById(req, res);

            expect(studentServices.getStudentByIdService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    data: expect.objectContaining({
                        _id: studentId,
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

            const studentId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "getStudentByIdService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Aluno não encontrado",
                });

            await listById(req, res);

            expect(studentServices.getStudentByIdService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Aluno não encontrado",
                });

        });

        it("deve retornar erro interno quando getStudentByIdService lançar exceção", async () => {

            const studentId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "getStudentByIdService")
                .mockRejectedValue(
                    new Error("Erro inesperado"),
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await listById(req, res);

            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(studentServices.getStudentByIdService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
            });
        });
    });
});

describe("updateStudent Controller", () => {

    describe("Sucesso", () => {

        it("deve atualizar um aluno(a) com sucesso", async () => {

            const studentId = new Types.ObjectId();
            const classId = new Types.ObjectId();

            const body = {
                name: "Luís Otávio",
                birthDate: birthDate,
                gender: "male",
                disability: "Autismo",
                classId,
            };

            const req = mockRequest(
                body,
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "updateStudentService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        _id: studentId,
                        ...body,
                    } as any,
                });

            await updateStudent(req, res);

            expect(studentServices.updateStudentService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                    body,
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Aluno(a) atualizado(a) com sucesso",
                    data: expect.objectContaining({
                        _id: studentId,
                        ...body,
                    }),
                });
        });
    });

    describe("Erros", () => {
        it("deve retornar erro quando o service retornar erro", async () => {

            const studentId = new Types.ObjectId();
            const classId = new Types.ObjectId();

            const body = {
                name: "Luís Otávio",
                birthDate: birthDate,
                gender: "male",
                disability: "Autismo",
                classId,
            };

            const req = mockRequest(
                body,
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "updateStudentService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Aluno não encontrado",
                });

            await updateStudent(req, res);

            expect(studentServices.updateStudentService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                    body,
                );

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Aluno não encontrado",
                });
        });

        it("deve retornar erro interno quando updateStudentService lançar exceção", async () => {

            const studentId = new Types.ObjectId();
            const classId = new Types.ObjectId();

            const body = {
                name: "Luís Otávio",
                birthDate,
                gender: "male",
                disability: "Autismo",
                classId,
            };

            const req = mockRequest(
                body,
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "updateStudentService")
                .mockRejectedValue(
                    new Error("Erro inesperado"),
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await updateStudent(req, res);

            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(studentServices.updateStudentService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                    body,
                );

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });
        });
    })
});

describe("deleteStudentById Controller", () => {

    describe("Sucesso", () => {

        it("deve deletar um aluno(a) com sucesso", async () => {

            const studentId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "deleteStudentService")
                .mockResolvedValue({
                    error: false,
                    data: undefined,
                });

            await deleteStudentById(req, res);

            expect(studentServices.deleteStudentService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Aluno(a) deletado(a) com sucesso",
                });

        });

    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async () => {

            const studentId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "deleteStudentService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Aluno(a) não encontrado"
                });

            await deleteStudentById(req, res);

            expect(studentServices.deleteStudentService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Aluno(a) não encontrado",
                });
        });

        it("deve retornar erro interno quando deleteStudentService lançar exceção", async () => {

            const studentId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: studentId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(studentServices, "deleteStudentService")
                .mockRejectedValue(
                    new Error("Erro inesperado"),
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await deleteStudentById(req, res);

            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(studentServices.deleteStudentService)
                .toHaveBeenCalledWith(
                    studentId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });
        });
    })
});