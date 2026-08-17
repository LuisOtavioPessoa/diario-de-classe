import { describe, it, expect, vi, afterEach } from "vitest";
import { mockRequest, mockResponse } from "../../helpers/http";
import * as performancesServices from "../../../modules/performances/performances.services";
import { create, listByStudent, getPerformanceByMonth, updatePerformance, deletePerformanceById } from "../../../modules/performances/performances.controller";
import { Types } from "mongoose";

const studentId = "user123";
const classId = "class123";
const month = 2;
const year = 2026;
const description = "Aluno com ótima escrita";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("create Controller", () => {

    describe("Sucesso", () => {

        it("deve criar um desempenho com sucesso", async () => {

            const req = mockRequest(
                {
                    studentId,
                    classId,
                    month,
                    year,
                    description,
                },
                {},
                {},
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "createPerformanceService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        studentId,
                        classId,
                        month,
                        year,
                        description,
                    } as any,
                });

            await create(req, res);

            expect(performancesServices.createPerformanceService)
                .toHaveBeenCalledWith(
                    studentId,
                    classId,
                    month,
                    year,
                    description,
                );

            expect(res.status)
                .toHaveBeenCalledWith(201);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Desempenho criado com sucesso",
                    data: expect.objectContaining({
                        studentId,
                        classId,
                        month,
                        year,
                        description,
                    }),
                });
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async() => {
           
            const req = mockRequest(
                {
                    studentId,
                    classId,
                    month,
                    year,
                    description,
                },
                {},
                {},
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "createPerformanceService")
                .mockResolvedValue({
                    error: true,
                    status: 409,
                    message: "Desempenho já cadastrado"
                });

            await create(req, res);

            expect(performancesServices.createPerformanceService)
                .toHaveBeenCalledWith(
                    studentId,
                    classId,
                    month,
                    year,
                    description,
                );

            expect(res.status)
                .toHaveBeenCalledWith(409);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Desempenho já cadastrado",
            });
        });

        it("deve retornar erro interno quando createPerformanceService lançar exceção", async() => {
           
            const req = mockRequest(
                {
                    studentId,
                    classId,
                    month,
                    year,
                    description,
                },
                {},
                {},
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "createPerformanceService")
                .mockRejectedValue(new Error("Erro inesperado"));

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await create(req, res);
            
            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
            });
        });
    })
});

describe("listByStudent Controller", () => {

    describe("Sucesso", () => {

        it("deve listar desempenho de um estudante com sucesso", async () => {

            const req = mockRequest(
                {},
                {
                    studentId: "user123",
                },
                {
                    page: "1",
                    limit: "10",
                    year: "2026",
                    month: "2",
                    search: "A",
                    sort: "year",
                    order: "asc",
                },
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "listPerformancesByStudentService")
                .mockResolvedValue({
                    error: false,
                    data: [
                        {
                            studentId,
                            classId,
                            month,
                            year,
                            description,
                        } as any,
                    ],
                    pagination: {
                        page: 1,
                        limit: 10,
                        total: 1,
                        totalPages: 1,
                    },
                });

            await listByStudent(req, res);

            expect(performancesServices.listPerformancesByStudentService)
                .toHaveBeenCalledWith(
                    "user123",
                    1,
                    10,
                    2026,
                    2,
                    "A",
                    "year",
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
                {},
                {},
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "listPerformancesByStudentService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Aluno(a) não encontrado(a)",
                });

            await listByStudent(req, res);

            expect(performancesServices.listPerformancesByStudentService)
                .toHaveBeenCalledWith(
                    undefined,
                    NaN,
                    NaN,
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
                    message: "Aluno(a) não encontrado(a)",
            });
        });

        it("deve retornar erro interno quando listPerformancesByStudentService lançar exceção", async () => {

            const req = mockRequest(
                {},
                {},
                {},
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "listPerformancesByStudentService")
                .mockRejectedValue(
                    new Error("Erro inesperado")
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await listByStudent(req, res);

            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });
        });

    })
});

describe("getPerformanceByMonth Controller", () => {

    describe("Sucesso", () => {

        it("deve listar o desempenho do estudante por mês com sucesso", async () => {

            const req = mockRequest(
                {},
                {
                    studentId: "user123",
                },
                {
                    year: "2026",
                    month: "2",
                },
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "getPerformanceByMonthService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        studentId,
                        year,
                        month,
                    } as any,
                });

            await getPerformanceByMonth(req, res);

            expect(performancesServices.getPerformanceByMonthService)
                .toHaveBeenCalledWith(
                    "user123",
                    2,
                    2026,
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Desempenho específico do(a) aluno(a) listado com sucesso",
                    data: expect.objectContaining({
                        studentId,
                        year,
                        month,
                    }),
                });
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async () => {

            const req = mockRequest(
                {},
                {
                    studentId: "user123",
                },
                {
                    year: "2026",
                    month: "2",
                },
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "getPerformanceByMonthService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Desempenho não encontrado",
                });

            await getPerformanceByMonth(req, res);

            expect(performancesServices.getPerformanceByMonthService)
                .toHaveBeenCalledWith(
                    "user123",
                    2,
                    2026,
                );

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Desempenho não encontrado",
                });
        });

        it("deve retornar erro interno quando getPerformanceByMonthService lançar exceção", async () => {

            const req = mockRequest(
                {},
                {
                    studentId: "user123",
                },
                {
                    year: "2026",
                    month: "2",
                },
                {},
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "getPerformanceByMonthService")
                .mockRejectedValue(
                    new Error("Erro inesperado"),
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await getPerformanceByMonth(req, res);

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

describe("updatePerformance Controller", () => {

    describe("Sucesso", () => {

        it("deve atualizar um desempenho com sucesso", async () => {

            const performanceId = new Types.ObjectId();

            const body = {
                description: "Aluno com dificuldade na oratória",
            };

            const req = mockRequest(
                body,
                {
                    id: performanceId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "updatePerformanceService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        _id: performanceId,
                        ...body,
                    } as any,
                });

            await updatePerformance(req, res);

            expect(performancesServices.updatePerformanceService)
                .toHaveBeenCalledWith(
                    performanceId.toString(),
                    body.description,
                );

            expect(res.status)
            .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Desempenho atualizado com sucesso",
                    data: expect.objectContaining({
                        _id: performanceId,
                        ...body,
                    }),
                });  
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async() => {

            const performanceId = new Types.ObjectId();

            const body = {
                description: "Aluno com dificuldade na oratória",
            };

            const req = mockRequest(
                body,
                {
                    id: performanceId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "updatePerformanceService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Desempenho não encontrado",
                });

            await updatePerformance(req, res);

            expect(performancesServices.updatePerformanceService)
                .toHaveBeenCalledWith(
                    performanceId.toString(),
                    body.description,
                );

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Desempenho não encontrado",
                });
        })

        it("deve retornar erro interno quando updatePerformanceService lançar exceção", async () => {

            const performanceId = new Types.ObjectId();

            const body = {
                description: "Aluno com dificuldade na oratória",
            };

            const req = mockRequest(
                body,
                {
                    id: performanceId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "updatePerformanceService")
                .mockRejectedValue(
                    new Error("Erro inesperado"),
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await updatePerformance(req, res);

            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(performancesServices.updatePerformanceService)
                .toHaveBeenCalledWith(
                    performanceId.toString(),
                    body.description,
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

describe("deletePerformanceById Controller", () => {

    describe("Sucesso", () => {

        it("deve deletar um desempenho com sucesso", async () => {

            const performanceId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: performanceId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "deletePerformanceService")
                .mockResolvedValue({
                    error: false,
                    data: undefined,
                });

            await deletePerformanceById(req, res);

            expect(performancesServices.deletePerformanceService)
                .toHaveBeenCalledWith(
                    performanceId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Desempenho deletado com sucesso",
                });
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async() => {

            const performanceId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: performanceId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "deletePerformanceService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Desempenho não encontrado"
                });

            await deletePerformanceById(req, res);

            expect(performancesServices.deletePerformanceService)
                .toHaveBeenCalledWith(
                    performanceId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Desempenho não encontrado",
                });
        });

        it("deve retornar erro interno quando deletePerformanceService lançar exceção", async() => {

            const performanceId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: performanceId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(performancesServices, "deletePerformanceService")
                .mockRejectedValue(
                    new Error("Erro inesperado"),
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await deletePerformanceById(req, res);

            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(performancesServices.deletePerformanceService)
                .toHaveBeenCalledWith(
                    performanceId.toString(),
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