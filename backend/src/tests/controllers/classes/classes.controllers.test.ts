import { describe, it, expect, vi, afterEach } from "vitest";
import { mockRequest, mockResponse } from "../../helpers/http";
import * as classesServices from "../../../modules/classes/classes.services";
import { Types } from "mongoose";
import { create, deleteClassById, list } from "../../../modules/classes/classes.controller";

const name = "6° A";
const year = 2026;

afterEach(() => {
    vi.restoreAllMocks();
});

describe("create Controller", () => {

    describe("Sucesso", () => {

        it("deve criar uma turma com sucesso", async () => {

            const req = mockRequest(
                {
                    name,
                    year,
                },
                {},
                {},
                {id: "user123"}
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "createClassService")
                .mockResolvedValue({
                    error: false,
                    data: {
                        id: "class123",
                        name,
                        year
                    } as any,
                });

            await create(req, res);
            
            expect(classesServices.createClassService)
                .toHaveBeenCalledWith(
                    name,
                    year,
                    "user123",
                );

            expect(res.status)
                .toHaveBeenCalledWith(201);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Turma criada com sucesso",
                    data: expect.objectContaining({
                        id: "class123",
                        name,
                        year,
                    }),
                });
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async() => {

            const req = mockRequest(
                {
                    name,
                    year,
                },
                {},
                {},
                {id: "user123"}
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "createClassService")
                .mockResolvedValue({
                    error: true,
                    status: 409,
                    message: "Turma já cadastrada",
                });

            await create(req, res);
            
            expect(classesServices.createClassService)
                .toHaveBeenCalledWith(
                    name,
                    year,
                    "user123",
                );

            expect(res.status)
                .toHaveBeenCalledWith(409);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Turma já cadastrada",
                });
        });

        it("deve retornar erro interno quando createClassService lançar exceção", async() => {

            const req = mockRequest(
                {
                    name,
                    year,
                },
                {},
                {},
                {id: "user123"}
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "createClassService")
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
    });
});

describe("list Controller", () => {

    describe("Sucesso", () => {

        it("deve listar classes com sucesso", async () => {

            const req = mockRequest(
                {},
                {},

                {
                    page: "1",
                    limit: "10",
                    search: "A",
                    year: "2026",
                    sort: "year",
                    order: "asc",
                },

                {
                    id: "user123",
                }
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "listClassesService")
                .mockResolvedValue({
                    error: false,
                    data: [
                        {
                            _id: new Types.ObjectId(),
                            name,
                            year,
                        } as any,
                    ],
                    pagination: {
                        page: 1,
                        limit: 10,
                        total: 1,
                        totalPages: 1,
                    },
                });

            await list(req, res);

            expect(classesServices.listClassesService)
                .toHaveBeenCalledWith(
                    "user123",
                    1,
                    10,
                    "A",
                    2026,
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
                {
                    id: "user123",
                }
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "listClassesService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Turma não encontrada",
                });

            await list(req, res);

            expect(classesServices.listClassesService)
                .toHaveBeenCalledWith(
                    "user123",
                    NaN,
                    NaN,
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

        it("deve retornar erro interno quando listClassesService lançar exceção", async () => {

            const req = mockRequest(
                {},
                {},
                {},
                {
                    id: "user123",
                }
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "listClassesService")
                .mockRejectedValue(
                    new Error("Erro inesperado")
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await list(req, res);

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

describe("deleteClassById Controller", () => {

    describe("Sucesso", () => {

        it("deve deletar uma classe com sucesso", async () => {

            const classId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: classId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "deleteClassService")
                .mockResolvedValue({
                    error: false,
                    data: undefined,
                });

            await deleteClassById(req, res);

            expect(classesServices.deleteClassService)
                .toHaveBeenCalledWith(
                    classId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Turma deletada com sucesso",
                });
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o service retornar erro", async () => {

            const classId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: classId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "deleteClassService")
                .mockResolvedValue({
                    error: true,
                    status: 404,
                    message: "Turma não encontrada"
                });

            await deleteClassById(req, res);

            expect(classesServices.deleteClassService)
                .toHaveBeenCalledWith(
                    classId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Turma não encontrada"
                });
        });

        it("deve retornar erro interno quando deleteClassService lançar exceção", async () => {

            const classId = new Types.ObjectId();

            const req = mockRequest(
                {},
                {
                    id: classId.toString(),
                }
            );

            const res = mockResponse();

            vi.spyOn(classesServices, "deleteClassService")
                .mockRejectedValue(
                    new Error("Erro inesperado"),
                );

            const consoleSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await deleteClassById(req, res);

            expect(consoleSpy)
                .toHaveBeenCalled();

            expect(classesServices.deleteClassService)
                .toHaveBeenCalledWith(
                    classId.toString(),
                );

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro interno do servidor",
                });
        });
    });
})