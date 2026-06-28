import { describe, it, expect, vi, afterEach } from "vitest";
import {
  createClassService,
  listClassesService,
  deleteClassService,
} from "../../../modules/classes/classes.services";
import { ClassDocument } from "../../../modules/classes/classes.model";
import { Class } from "../../../modules/classes/classes.model";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createClassService", () => {
  it("deve criar uma turma com sucesso", async () => {
    vi.spyOn(Class, "findOne").mockResolvedValue(null);

    const createdClass = {
      _id: "1",
      name: "Turma A",
      year: 2025,
      userId: "123",
    };

    vi.spyOn(Class, "create").mockResolvedValue(createdClass as any);

    const result = await createClassService(
      "Turma A",
      2025,
      "123"
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

  it("deve retornar erro quando a turma já existir", async () => {
    vi.spyOn(Class, "findOne").mockResolvedValue({} as any);

    const result = await createClassService(
      "Turma A",
      2025,
      "123"
    );

    expect(result.error).toBe(true);

    if (result.error) {
      expect(result.status).toBe(409);
      expect(result.message).toBe(
        "Já existe uma turma com esse nome nesse ano"
      );
    }
  });
});

describe("listClassesService", () => {
  function mockChain(fakeClasses: any[]) {
    const limitMock = vi.fn().mockResolvedValue(fakeClasses);

    const skipMock = vi.fn().mockReturnValue({
      limit: limitMock,
    });

    const sortMock = vi.fn().mockReturnValue({
      skip: skipMock,
    });

    const findMock = vi
      .spyOn(Class, "find")
      .mockReturnValue({
        sort: sortMock,
      } as any);

    const countMock = vi
      .spyOn(Class, "countDocuments")
      .mockResolvedValue(fakeClasses.length);

    return {
      findMock,
      sortMock,
      skipMock,
      limitMock,
      countMock,
    };
  }

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

    const mocks = mockChain(fakeClasses);

    const result = await listClassesService(
      "123",
      1,
      10
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
  });

  it("deve listar turmas filtrando por nome", async () => {
    const fakeClasses = [
      {
        _id: "1",
        name: "Turma A",
        year: 2025,
      },
    ];

    const mocks = mockChain(fakeClasses);

    await listClassesService(
      "123",
      1,
      10,
      "Turma"
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

    const mocks = mockChain(fakeClasses);

    await listClassesService(
      "123",
      1,
      10,
      undefined,
      2025
    );

    expect(mocks.findMock).toHaveBeenCalledWith({
      userId: "123",
      year: 2025,
    });
  });

  it("deve ordenar por nome crescente", async () => {
    const fakeClasses: ClassDocument[] = [];

    const mocks = mockChain(fakeClasses);

    await listClassesService(
      "123",
      1,
      10,
      undefined,
      undefined,
      "name",
      "asc"
    );

    expect(mocks.sortMock).toHaveBeenCalledWith({
      name: 1,
    });
  });

  it("deve ordenar por ano decrescente", async () => {
    const fakeClasses: ClassDocument[] = [];

    const mocks = mockChain(fakeClasses);

    await listClassesService(
      "123",
      1,
      10,
      undefined,
      undefined,
      "year",
      "desc"
    );

    expect(mocks.sortMock).toHaveBeenCalledWith({
      year: -1,
    });
  });
});

describe("deleteClassService", () => {
  it("deve deletar uma turma com sucesso", async () => {
    vi.spyOn(Class, "findByIdAndDelete")
      .mockResolvedValue({} as any);

    const result = await deleteClassService("123");

    expect(result.error).toBe(false);
  });

  it("deve retornar erro quando a turma não existir", async () => {
    vi.spyOn(Class, "findByIdAndDelete")
      .mockResolvedValue(null);

    const result = await deleteClassService("123");

    expect(result.error).toBe(true);

    if (result.error) {
      expect(result.status).toBe(404);

      expect(result.message).toBe(
        "Turma não encontrada"
      );
    }
  });
});