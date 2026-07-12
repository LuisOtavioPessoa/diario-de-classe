import { describe, it, expect, vi, afterEach } from "vitest";
import { Class } from "../../../modules/classes/classes.model";
import { Performance } from "../../../modules/performances/performances.model";
import { Student } from "../../../modules/students/students.model";
import { createPerformanceService, deletePerformanceService, getPerformanceByMonthService, listPerformancesByStudentService, updatePerformanceService } from "../../../modules/performances/performances.services";
import { setupPerformanceListMocks, setupStudentExists} from "../../helpers/setupPerformanceListMocks";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createPerformanceService", () => {

    describe("Sucesso", () => {

        it("deve criar uma performance com sucesso", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue({ _id: "class123" } as any);

            vi.spyOn(Student, "findById")
                .mockResolvedValue({
                    classId: {
                        toString: () => "class123",
                    },
                } as any);

            vi.spyOn(Performance, "findOne")
                .mockResolvedValue(null);

            const createdPerformance = {
                _id: "1",
                month: 2,
                year: 2026,
                description: "Ótimo foco nas aulas",
                studentId: "100",
                classId: "class123",
            };

            vi.spyOn(Performance, "create")
                .mockResolvedValue(createdPerformance as any);

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(result.error).toBe(false);

            if (!result.error) {
                expect(result.data).toEqual(createdPerformance);
            }

            expect(Class.findById).toHaveBeenCalledWith("class123");

            expect(Student.findById).toHaveBeenCalledWith("100");

            expect(Performance.findOne).toHaveBeenCalledWith({
                studentId: "100",
                month: 2,
                year: 2026,
            });

            expect(Performance.create).toHaveBeenCalledWith({
                studentId: "100",
                classId: "class123",
                month: 2,
                year: 2026,
                description: "Ótimo foco nas aulas",
            });

        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando a turma não foi encontrada", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue(null);

            const studentSpy = vi.spyOn(Student, "findById");
            const performanceSpy = vi.spyOn(Performance, "findOne");
            const createSpy = vi.spyOn(Performance, "create");

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(result.error).toBe(true);
            expect(studentSpy).not.toHaveBeenCalled();
            expect(performanceSpy).not.toHaveBeenCalled();
            expect(createSpy).not.toHaveBeenCalled();

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe(
                    "Turma não encontrada",
                );
            }            
        });

        it("não deve buscar aluno quando a turma não existir", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue(null);

            const studentSpy = vi.spyOn(Student, "findById");

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(studentSpy).not.toHaveBeenCalled()

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe(
                    "Turma não encontrada",
                );
            }              
        });

        it("deve retornar erro quando o aluno não existir", async () => {

            const classSpy = vi.spyOn(Class, "findById")
                .mockResolvedValue({} as any);

            vi.spyOn(Student, "findById")
                .mockResolvedValue(null);

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(classSpy).toHaveBeenCalledWith("class123");

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe(
                    "Aluno(a) não encontrado(a)",
                );
            }              
        });

        it("não deve consultar Performance.findOne quando o aluno não existir", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue({} as any);

            vi.spyOn(Student, "findById")
                .mockResolvedValue(null);

            const findOneSpy = vi.spyOn(Performance, "findOne");

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(findOneSpy).not.toHaveBeenCalled()

            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(404);
                expect(result.message).toBe("Aluno(a) não encontrado(a)");
            }
        });
        
        it("deve retornar erro quando o aluno não pertence à turma", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue({} as any);

            vi.spyOn(Student, "findById")
                .mockResolvedValue({
                classId: {
                    toString: () => "class999",
                },
            } as any);

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(400);
                expect(result.message).toBe("O aluno(a) não pertence à turma informada.");
            }
        }); 

        it("não deve criar performance quando o aluno não pertence à turma", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue({} as any);

            vi.spyOn(Student, "findById")
                .mockResolvedValue({
                classId: {
                    toString: () => "class999",
                },
            } as any);

            const findOneSpy = vi.spyOn(Performance, "findOne");

            const createSpy = vi.spyOn(Performance, "create");

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(findOneSpy).not.toHaveBeenCalled()
            expect(createSpy).not.toHaveBeenCalled()
            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(400);
                expect(result.message).toBe("O aluno(a) não pertence à turma informada.");
            }
        }); 
 
        it("deve retornar erro quando já existir uma performance nesse mês e ano", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue({} as any);

            vi.spyOn(Student, "findById")
                .mockResolvedValue({
                    classId: {
                        toString: () => "class123",
                    },
                } as any);

            vi.spyOn(Performance, "findOne")
                .mockResolvedValue({} as any);

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(409);
                expect(result.message).toBe("Já existe um desempenho para esse aluno nesse mês e ano");
            }
        }); 

        it("não deve criar performance quando ela já existir", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue({} as any);

            vi.spyOn(Student, "findById")
                .mockResolvedValue({
                    classId: {
                        toString: () => "class123",
                    },
                } as any);

            vi.spyOn(Performance, "findOne")
                .mockResolvedValue({} as any);

            const createSpy = vi.spyOn(Performance, "create");

            const result = await createPerformanceService(
                "100",
                "class123",
                2,
                2026,
                "Ótimo foco nas aulas",
            );

            expect(createSpy).not.toHaveBeenCalled()

            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(409);
                expect(result.message).toBe("Já existe um desempenho para esse aluno nesse mês e ano");
            }
        }); 
    });
});

describe("listPerformancesByStudentService", () => {

    describe("Sucesso", () => {
        it("deve listar os desempenhos do aluno com sucesso", async() => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno com dificuldade de cálculos básicos."
                },
                {
                    _id: "1",
                    month: 3,
                    year: 2026,
                    description: "Aluno apresenta melhora com cálculos básicos"
                }
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            const result = await listPerformancesByStudentService(
                "123",
                1,
                10,
            )

            expect(result.error).toBe(false);

            if (!result.error) {

                expect(result.data).toEqual(fakePerformances);

                expect(result.pagination).toEqual({
                    page: 1,
                    limit: 10,
                    total: 2,
                    totalPages: 1,
                });
            }

                expect(mocks.findMock).toHaveBeenCalledWith({
                    studentId: "123",
                });

                expect(mocks.sortMock).toHaveBeenCalledWith({
                    year: -1,
                    month: -1,
                });

                expect(mocks.skipMock).toHaveBeenCalledWith(0);

                expect(mocks.limitMock).toHaveBeenCalledWith(10);

                expect(mocks.countMock).toHaveBeenCalledWith({
                    studentId: "123",
                });           
            })
        });

    describe("Erros", () => {
        it("deve retornar erro quando o aluno não existir", async () => {

            const studentSpy = vi.spyOn(Student, "findById")
                .mockResolvedValue(null);

            const result = await listPerformancesByStudentService(
                "100",
                 1,
                 10,
            );

            expect(studentSpy).toHaveBeenCalledWith("100");

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Aluno(a) não encontrado(a)");
            }
        });
    
        it("não deve buscar desempenho quando o aluno não existir", async () => {

            vi.spyOn(Student, "findById")
                .mockResolvedValue(null);

            const Performancepy = vi.spyOn(Performance, "findOne");

            const result = await listPerformancesByStudentService(
                "100",
                 1,
                 10,
            );

            expect(Performancepy).not.toHaveBeenCalled()

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe(
                    "Aluno(a) não encontrado(a)",
                );
            }              
        });
    });

    describe("Filtros", () => {

        it("deve filtrar desempenhos por descrição", async () => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno faltando demais."
                },
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                undefined,
                "faltando",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                studentId: "123",
                description: {
                    $regex: "faltando",
                    $options: "i",
                },
            });
        });

        it("deve filtrar desempenhos por ano", async () => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno faltando demais."
                },
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                2026,
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                studentId: "123",
                year: 2026,
            });
        });
        
        it("deve filtrar desempenhos por mês", async () => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno faltando demais."
                },
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                2
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                studentId: "123",
                month: 2,
            });
        });

        it("deve combinar filtros de descrição e ano", async () => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno faltando demais."
                },
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                2026,
                undefined,
                "faltando",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                studentId: "123",
                description: {
                    $regex: "faltando",
                    $options: "i",
                },
                year: 2026
            });
        });

        it("deve combinar filtros de ano e mês", async () => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno faltando demais."
                },
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                2026,
                2,
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                studentId: "123",
                year: 2026,
                month: 2,
            });
        });

        it("deve combinar descrição, ano e mês", async () => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno faltando demais."
                },
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                2026,
                2,
                "faltando"
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                studentId: "123",
                description: {
                    $regex: "faltando",
                    $options: "i",              
                },
                year: 2026,
                month: 2,
            });
        });

        it("deve remover espaços da busca antes de filtrar", async () => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno faltando demais."
                },
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                undefined,
                "   faltando   ",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                studentId: "123",
                description: {
                    $regex: "faltando",
                    $options: "i",
                },
            });

        });
    });

    describe("Ordenação", () => {

        it("deve ordenar por ano crescente", async () => {

            setupStudentExists();

            const mocks = setupPerformanceListMocks([]);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                "year",
                "asc"
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                year: 1,
            });
        });

        it("deve ordenar por ano decrescente", async () => {

            setupStudentExists();

            const mocks = setupPerformanceListMocks([]);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                "year",
                "desc"
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                year: -1,
            });
        });

        it("deve ordenar por mês crescente", async () => {

            setupStudentExists();

            const mocks = setupPerformanceListMocks([]);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                "month",
                "asc"
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                month: 1,
            });
        });

        it("deve ordenar por mês decrescente", async () => {

            setupStudentExists();

            const mocks = setupPerformanceListMocks([]);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                "month",
                "desc"
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                month: -1,
            });
        });

        it("deve ordenar por data de criação crescente", async () => {

            setupStudentExists();

            const mocks = setupPerformanceListMocks([]);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                "createdAt",
                "asc"
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                createdAt: 1,
            });
        });

        it("deve ordenar por data de criação decrescente", async () => {

            setupStudentExists();

            const mocks = setupPerformanceListMocks([]);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                "createdAt",
                "desc"
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                createdAt: -1,
            });
        });

        it("deve utilizar ordenação padrão quando nenhum sort for informado", async () => {

            setupStudentExists();

            const mocks = setupPerformanceListMocks([]);

            await listPerformancesByStudentService(
                "123",
                1,
                10,
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                year: -1,
                month: -1,
            });

        });
    });

    describe("Paginação", () => {

        it("deve aplicar paginação corretamente", async () => {

            setupStudentExists();

            const fakePerformances = [
                {
                    _id: "1",
                    month: 2,
                    year: 2026,
                    description: "Aluno faltando demais.",
                },
            ];

            const mocks = setupPerformanceListMocks(fakePerformances);

            await listPerformancesByStudentService(
                "123",
                2,
                5,
            );

            expect(mocks.skipMock).toHaveBeenCalledWith(5);
            expect(mocks.limitMock).toHaveBeenCalledWith(5);
        });
    });

});

describe("getPerformanceByMonthService", () => {

    describe("Sucesso", () => {

        it("deve retornar um desempenho pelo mês e ano", async () => {

            const fakePerformance = {
                _id: "1",
                studentId: "100",
                classId: "class123",
                month: 2,
                year: 2026,
                description: "Ótimo foco nas aulas",
            };
             
            const studentSpy = vi.spyOn(Student, "findById")
                .mockResolvedValue({} as any);

            const performanceSpy = vi.spyOn(Performance, "findOne")
                .mockResolvedValue(fakePerformance as any);

            const result = await getPerformanceByMonthService(
                "100",
                2,
                2026,
            );

            expect(studentSpy).toHaveBeenCalledWith("100")

            expect(performanceSpy).toHaveBeenCalledWith({
                studentId: "100",
                month: 2,
                year: 2026,
            });

            expect(result.error).toBe(false);

            if (!result.error) {
                expect(result.data).toEqual(fakePerformance);
            }
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o aluno não existir", async () => {

            const studentSpy = vi.spyOn(Student, "findById")
                .mockResolvedValue(null);

            const result = await getPerformanceByMonthService(
                "100",
                2,
                2026,
            );

            expect(studentSpy).toHaveBeenCalledWith("100");

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Aluno(a) não encontrado(a)");
            }

        });

        it("não deve buscar desempenho quando o aluno não existir", async () => {

            vi.spyOn(Student, "findById")
                .mockResolvedValue(null);

            const Performancepy = vi.spyOn(Performance, "findOne");

            const result = await getPerformanceByMonthService(
                "100",
                2,
                2026,
            );

            expect(Performancepy).not.toHaveBeenCalled()

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe(
                    "Aluno(a) não encontrado(a)",
                );
            }              
        });

        it("deve retornar erro quando o desempenho não existir", async () => {

            vi.spyOn(Student, "findById")
                .mockResolvedValue({} as any);

            const performanceSpy = vi.spyOn(Performance, "findOne")
                .mockResolvedValue(null);

            const result = await getPerformanceByMonthService(
                "100",
                2,
                2026,
            );

            expect(performanceSpy).toHaveBeenCalledWith({
                studentId: "100",
                month: 2,
                year: 2026,
            });

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Desempenho não encontrado");
            }
        });
    });
});


describe("updatePerformanceService", () => {

    describe("Sucesso", () => {

        it("deve atualizar um desempenho com sucesso", async () => {

            const description = "Aluno conversando muito na aula";
            
            const updatePerfomance = {
                _id: "123",
                studentId: "student1",
                classId: "class123",
                month: 2,
                year: 2026,
                description: "Aluno conversando muito na aula",
            };

            const spy = vi.spyOn(Performance, "findByIdAndUpdate")
                .mockResolvedValue(updatePerfomance as any);

            const result = await updatePerformanceService(
                "123",
                description,
            );

            expect(spy).toHaveBeenCalledWith(
                "123",
                {
                    description,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

            expect(result.error).toBe(false);

            if(!result.error){
                expect(result.data).toEqual(updatePerfomance);
            }
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o desempenho não existir", async () => {

            const description = "Aluno conversando muito na aula";
            
            const spy = vi.spyOn(Performance, "findByIdAndUpdate")
                .mockResolvedValue(null);

            const result = await updatePerformanceService(
                "123",
                description,
            );        

            expect(spy).toHaveBeenCalledWith(
                "123",
                {
                    description
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Desempenho não encontrado");
            }   
        });
    });
});

describe("deletePerformanceService", () => {

    describe("Sucesso", () => {

        it("deve deletar um desempenho com sucesso", async () => {

            const spy = vi.spyOn(Performance, "findByIdAndDelete")
                .mockResolvedValue({} as any);

            const result  = await deletePerformanceService("123");

            expect(spy).toHaveBeenCalledWith("123");
            expect(result.error).toBe(false);

            if (!result.error) {
                expect(result.data).toBeUndefined();
            }

        });

    });

    describe("Erros", () => {

        it("deve retornar erro quando o desempenho não existir", async () => {
            const spy = vi.spyOn(Performance, "findByIdAndDelete")
                .mockResolvedValue(null);

            const result = await deletePerformanceService("123");

            expect(spy).toHaveBeenCalledWith("123");
            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Desempenho não encontrado");
            }
        });

    });

});