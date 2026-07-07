import { describe, it, expect, vi, afterEach } from "vitest";
import { Class } from "../../../modules/classes/classes.model";
import { Performance } from "../../../modules/performances/performances.model";
import { Student } from "../../../modules/students/students.model";
import { createPerformanceService, deletePerformanceService, updatePerformanceService } from "../../../modules/performances/performances.services";

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