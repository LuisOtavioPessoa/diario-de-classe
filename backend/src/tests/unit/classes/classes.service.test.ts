import { describe, it, expect, vi, afterEach } from "vitest";
import {
  createClassService,
  listClassesService,
  deleteClassService,
} from "../../../modules/classes/classes.services";
import { ClassDocument } from "../../../modules/classes/classes.model";
import { Class } from "../../../modules/classes/classes.model";
import { setupClassListMocks } from "../../helpers/setupClassListMocks";


afterEach(() => {
  vi.restoreAllMocks();
});

describe("createClassService", () => {

    describe("Sucesso", () => {

        it("deve criar uma turma com sucesso", async () => {

            vi.spyOn(Class, "findOne")
                .mockResolvedValue(null);

            const createdClass = {
                _id: "1",
                name: "Turma A",
                year: 2025,
                userId: "123",
            };

            vi.spyOn(Class, "create")
                .mockResolvedValue(createdClass as any);

            const result = await createClassService(
                "Turma A",
                2025,
                "123",
            );

            expect(result.error).toBe(false);

            if (!result.error) {
                expect(result.data).toEqual(createdClass);
            }

            expect(Class.findOne).toHaveBeenCalledWith({
                name: "Turma A",
                year: 2025,
                userId: "123",
            });

            expect(Class.create).toHaveBeenCalledWith({
                name: "Turma A",
                year: 2025,
                userId: "123",
            });

        });

    });

    describe("Erros", () => {

        it("deve retornar erro quando a turma já existir", async () => {

            vi.spyOn(Class, "findOne")
                .mockResolvedValue({} as any);

            const result = await createClassService(
                "Turma A",
                2025,
                "123",
            );

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(409);
                expect(result.message).toBe(
                    "Já existe uma turma com esse nome nesse ano",
                );
            }

        });

        it("não deve criar uma turma quando ela já existir", async () => {

            vi.spyOn(Class, "findOne")
                .mockResolvedValue({} as any);

            const createSpy = vi.spyOn(Class, "create");

            await createClassService(
                "Turma A",
                2025,
                "123",
            );

            expect(createSpy).not.toHaveBeenCalled();

        });
    });
});

describe("listClassesService", () => {

    describe("Sucesso", () => {

        it("deve listar turmas", async () => {

            const fakeClasses = [
                {
                    _id: "1",
                    name: "Turma A",
                    year: 2025,
                },
                {
                    _id: "2",
                    name: "Turma B",
                    year: 2024,
                },
            ];

            const mocks = setupClassListMocks(fakeClasses);

            const result = await listClassesService(
                "123",
                1,
                10,
            );

            expect(result.error).toBe(false);

            if (!result.error) {

                expect(result.data).toEqual(fakeClasses);

                expect(result.pagination).toEqual({
                    page: 1,
                    limit: 10,
                    total: 2,
                    totalPages: 1,
                });

            }

            expect(mocks.findMock).toHaveBeenCalledWith({
                userId: "123",
            });

            expect(mocks.sortMock).toHaveBeenCalledWith({
                year: -1,
                name: 1,
            });

            expect(mocks.skipMock).toHaveBeenCalledWith(0);

            expect(mocks.limitMock).toHaveBeenCalledWith(10);

            expect(mocks.countMock).toHaveBeenCalledWith({
                userId: "123",
            });

        });

    });

    describe("Filtros", () => {

        it("deve listar turmas filtrando por nome", async () => {

            const fakeClasses = [
                {
                    _id: "1",
                    name: "Turma A",
                    year: 2025,
                },
            ];

            const mocks = setupClassListMocks(fakeClasses);

            await listClassesService(
                "123",
                1,
                10,
                "Turma",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                userId: "123",
                name: {
                    $regex: "Turma",
                    $options: "i",
                },
            });

        });

        it("deve listar turmas filtrando por ano", async () => {

            const fakeClasses = [
                {
                    _id: "1",
                    name: "Turma A",
                    year: 2025,
                },
            ];

            const mocks = setupClassListMocks(fakeClasses);

            await listClassesService(
                "123",
                1,
                10,
                undefined,
                2025,
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                userId: "123",
                year: 2025,
            });

        });

        it("deve combinar filtros de nome e ano", async () => {

            const fakeClasses = [
                {
                    _id: "1",
                    name: "Turma A",
                    year: 2025,
                },
            ];

            const mocks = setupClassListMocks(fakeClasses);

            await listClassesService(
                "123",
                1,
                10,
                "Turma",
                2025,
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                userId: "123",
                name: {
                    $regex: "Turma",
                    $options: "i",
                },
                year: 2025,
            });

        });

    });

    describe("Ordenação", () => {

        it("deve ordenar por nome crescente", async () => {

            const mocks = setupClassListMocks([]);

            await listClassesService(
                "123",
                1,
                10,
                undefined,
                undefined,
                "name",
                "asc",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                name: 1,
            });
        });

        it("deve ordenar por nome decrescente", async () => {

            const mocks = setupClassListMocks([]);

            await listClassesService(
                "123",
                1,
                10,
                undefined,
                undefined,
                "name",
                "desc",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                name: -1,
            });
        });

        it("deve ordenar por ano crescente", async () => {

            const mocks = setupClassListMocks([]);

            await listClassesService(
                "123",
                1,
                10,
                undefined,
                undefined,
                "year",
                "asc",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                year: 1,
            });
        });

        it("deve ordenar por ano decrescente", async () => {

            const mocks = setupClassListMocks([]);

            await listClassesService(
                "123",
                1,
                10,
                undefined,
                undefined,
                "year",
                "desc",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                year: -1,
            });
        });

        it("deve ordenar por data de criação", async () => {

            const mocks = setupClassListMocks([]);

            await listClassesService(
                "123",
                1,
                10,
                undefined,
                undefined,
                "createdAt",
                "asc",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                createdAt: 1,
            });
        });
    });

    describe("Paginação", () => {

        it("deve aplicar paginação corretamente", async () => {

            const fakeClasses = [
                {
                    _id: "1",
                    name: "Turma A",
                    year: 2025,
                },
            ];

            const mocks = setupClassListMocks(fakeClasses);

            await listClassesService(
                "123",
                2,
                5,
            );

            expect(mocks.skipMock).toHaveBeenCalledWith(5);
            expect(mocks.limitMock).toHaveBeenCalledWith(5);

          });
      });
});

describe("deleteClassService", () => {

    describe("Sucesso", () => {

        it("deve deletar uma turma com sucesso", async () => {

            const spy = vi.spyOn(Class, "findByIdAndDelete")
                .mockResolvedValue({} as any);

            const result = await deleteClassService("123");

            expect(spy).toHaveBeenCalledWith("123");
            expect(result.error).toBe(false);

        });

    });

    describe("Erros", () => {

        it("deve retornar erro quando a turma não existir", async () => {

            const spy = vi.spyOn(Class, "findByIdAndDelete")
                .mockResolvedValue(null);

            const result = await deleteClassService("123");

            expect(spy).toHaveBeenCalledWith("123");

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Turma não encontrada");
            }
        });
    });
});