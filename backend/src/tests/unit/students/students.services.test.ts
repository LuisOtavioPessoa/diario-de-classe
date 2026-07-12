import { describe, it, expect, vi, afterEach } from "vitest";
import { createStudentService, deleteStudentService, getStudentByIdService, updateStudentService, listStudentsByClassService } from "../../../modules/students/students.services";
import { Student } from "../../../modules/students/students.model";
import { Class } from "../../../modules/classes/classes.model";
import { setupStudentListMocks } from "../../helpers/setupStudentListMocks";
import { fakeForeignClass } from "../../mocks/class";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createStudentService", () => {

    describe("Sucesso", () => {

        it("deve criar um aluno com sucesso", async () => {

            vi.spyOn(Class, "findById").mockResolvedValue({
                userId: {
                    toString: () => "123",
                },
            } as any);

            const createdStudent = {
                _id: "1",
                name: "João",
                birthDate: new Date("2020-01-01"),
                gender: "male",
                disability: null,
                classId: "class123",
            }; 

            vi.spyOn(Student, "create")
                .mockResolvedValue(createdStudent as any);

            const result = await createStudentService(
                "João",
                new Date("2020-01-01"),
                "male",
                null,
                "class123",
                "123",
            );

            expect(result.error).toBe(false);

            if(!result.error){
                expect(result.data).toEqual(createdStudent);
            }

            expect(Class.findById).toHaveBeenCalledWith("class123");

            expect(Student.create).toHaveBeenCalledWith({
                name: "João",
                birthDate: new Date("2020-01-01"),
                gender: "male",
                disability: null,
                classId: "class123",
            })
        });
    });

    describe("Permissões", () => {

        it("deve retornar erro quando a turma não existir", async () => {

            vi.spyOn(Class, "findById").mockResolvedValue(null);

            const result = await createStudentService(
                "João",
                new Date("2020-01-01"),
                "male",
                null,
                "class123",
                "123",
            );

            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(404);
                expect(result.message).toBe("Turma não encontrada");
            }
        });

        it("deve retornar erro quando o usuário não for dono da turma", async () => {

            vi.spyOn(Class, "findById").mockResolvedValue({
                userId: {
                    toString: () => "999",
                },
            } as any);

            const result = await createStudentService(
                "João",
                new Date("2020-01-01"),
                "male",
                null,
                "class123",
                "123",
            );

            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(403);
                expect(result.message).toBe("Acesso negado");
            }
        });

        it("não deve criar um aluno quando a turma não existir", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue(null);

            const createSpy = vi.spyOn(Student, "create");

            await createStudentService(
                "João",
                new Date(),
                "male",
                null,
                "class123",
                "123",
            );

            expect(createSpy).not.toHaveBeenCalled();

        });

        it("não deve criar um aluno quando o usuário não for dono da turma", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue({
                    userId: {
                        toString: () => "999",
                    },
                } as any);

            const createSpy = vi.spyOn(Student, "create");

            await createStudentService(
                "João",
                new Date(),
                "male",
                null,
                "class123",
                "123",
            );

            expect(createSpy).not.toHaveBeenCalled();
            });
        });
    });

describe("listStudentsByClassService", () => {

    describe("Sucesso", () => {

        it("deve listar os alunos de uma turma com sucesso", async () => {

            const fakeStudents = [
                {
                    _id: "1",
                    name: "João",
                    gender: "male",
                    disability: null,
                },
                {
                    _id: "2",
                    name: "Maria",
                    gender: "female",
                    disability: "Autismo",
                },
            ];

            const mocks = setupStudentListMocks(fakeStudents);

            const result = await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
            );

            expect(result.error).toBe(false);

            if (!result.error) {

                expect(result.data).toEqual(fakeStudents);

                expect(result.pagination).toEqual({
                    page: 1,
                    limit: 10,
                    total: 2,
                    totalPages: 1,
                });

            }

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
            });

            expect(mocks.sortMock).toHaveBeenCalledWith({
                name: 1,
            });

            expect(mocks.skipMock).toHaveBeenCalledWith(0);

            expect(mocks.limitMock).toHaveBeenCalledWith(10);

            expect(mocks.countMock).toHaveBeenCalledWith({
                classId: "class123",
            });

        });

        it("deve retornar uma lista vazia quando a turma não possuir alunos", async () => {

            const fakeStudents: any[] = [];

            const mocks = setupStudentListMocks(fakeStudents);

            const result = await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
            );

            expect(result.error).toBe(false);

            if (!result.error) {

                expect(result.data).toEqual([]);

                expect(result.pagination).toEqual({
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                });

            }

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
            });

        });

    });

    describe("Permissões", () => {

        it("deve retornar erro quando a turma não existir", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue(null);

            const result = await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
            );

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Turma não encontrada");
            }

        });

        it("deve retornar erro quando o usuário não for o dono da turma", async () => {

            vi.spyOn(Class, "findById")
                .mockResolvedValue(fakeForeignClass() as any);

            const result = await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
            );

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(403);
                expect(result.message).toBe("Acesso negado");
            }

        });

    });

    describe("Filtros", () => {

        it("deve listar alunos filtrando pelo nome", async () => {

            const fakeStudents = [
                {
                    _id: "1",
                    name: "João",
                    gender: "male",
                    disability: null,
                },
            ];

            const mocks = setupStudentListMocks(fakeStudents);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                "João",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
                name: {
                    $regex: "João",
                    $options: "i",
                },
            });

        });

        it("deve listar alunos filtrando pelo gênero masculino", async () => {

            const fakeStudents = [
                {
                    _id: "1",
                    name: "João",
                    gender: "male",
                    disability: null,
                },
            ];

            const mocks = setupStudentListMocks(fakeStudents);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                "male",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
                gender: "male",
            });

        });

        it("deve listar alunos filtrando pelo gênero feminino", async () => {

            const fakeStudents = [
                {
                    _id: "1",
                    name: "Maria",
                    gender: "female",
                    disability: null,
                },
            ];

            const mocks = setupStudentListMocks(fakeStudents);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                "female",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
                gender: "female",
            });

        });

        it("deve listar alunos filtrando pelo tipo de deficiência", async () => {

            const fakeStudents = [
                {
                    _id: "1",
                    name: "João",
                    gender: "male",
                    disability: "Autismo",
                },
            ];

            const mocks = setupStudentListMocks(fakeStudents);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                undefined,
                "Autismo",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
                disability: {
                    $regex: "Autismo",
                    $options: "i",
                },
            });

        });

        it("deve listar apenas alunos que possuem deficiência", async () => {

            const fakeStudents = [
                {
                    _id: "1",
                    name: "João",
                    gender: "male",
                    disability: "Autismo",
                },
            ];

            const mocks = setupStudentListMocks(fakeStudents);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                true,
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
                disability: {
                    $ne: null,
                },
            });

        });

        it("deve listar apenas alunos que não possuem deficiência", async () => {

            const fakeStudents = [
                {
                    _id: "1",
                    name: "Maria",
                    gender: "female",
                    disability: null,
                },
            ];

            const mocks = setupStudentListMocks(fakeStudents);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                false,
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
                disability: null,
            });

        });

        it("deve combinar múltiplos filtros na mesma consulta", async () => {

            const fakeStudents = [
                {
                    _id: "1",
                    name: "João",
                    gender: "male",
                    disability: "Autismo",
                },
            ];

            const mocks = setupStudentListMocks(fakeStudents);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                "João",
                undefined,
                "Autismo",
                "male",
            );

            expect(mocks.findMock).toHaveBeenCalledWith({
                classId: "class123",
                gender: "male",
                name: {
                    $regex: "João",
                    $options: "i",
                },
                disability: {
                    $regex: "Autismo",
                    $options: "i",
                },
            });

        });

    });

    describe("Ordenação", () => {

        it("deve ordenar alunos pelo nome em ordem crescente", async () => {

            const mocks = setupStudentListMocks([]);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                undefined,
                "name",
                "asc",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                name: 1,
            });

        });

        it("deve ordenar alunos pelo nome em ordem decrescente", async () => {

            const mocks = setupStudentListMocks([]);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                undefined,
                "name",
                "desc",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                name: -1,
            });

        });

        it("deve ordenar alunos pela data de nascimento", async () => {

            const mocks = setupStudentListMocks([]);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                undefined,
                "birthDate",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                birthDate: 1,
            });

        });

        it("deve ordenar alunos pelo gênero", async () => {

            const mocks = setupStudentListMocks([]);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                undefined,
                "gender",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                gender: 1,
            });

        });

        it("deve ordenar alunos pela data de criação", async () => {

            const mocks = setupStudentListMocks([]);

            await listStudentsByClassService(
                "class123",
                "user123",
                1,
                10,
                undefined,
                undefined,
                undefined,
                undefined,
                "createdAt",
            );

            expect(mocks.sortMock).toHaveBeenCalledWith({
                createdAt: 1,
            });

        });

    });

    describe("Paginação", () => {

        it("deve aplicar paginação corretamente", async () => {

            const mocks = setupStudentListMocks([]);

            await listStudentsByClassService(
                "class123",
                "user123",
                3,
                5,
            );

            expect(mocks.skipMock).toHaveBeenCalledWith(10);

            expect(mocks.limitMock).toHaveBeenCalledWith(5);

        });
    });
})

describe("getStudentByIdService", () => {

    describe("Sucesso", () => {

        it("deve listar um aluno pelo seu id específico", async () => {

            const fakeStudent = {
                _id: "123",
                name: "João",
                birthDate: new Date("2020-01-01"),
                gender: "male",
                disability: null,
                classId: "class123",
            };

            const spy = vi.spyOn(Student, "findById")
                .mockResolvedValue(fakeStudent as any);

            const result = await getStudentByIdService("123");

            expect(spy).toHaveBeenCalledWith("123");

            expect(result.error).toBe(false);

            if (!result.error) {
                expect(result.data).toEqual(fakeStudent);
            }

        });

    });

    describe("Erros", () => {

        it("deve retornar erro quando o aluno não existir", async () => {

            const spy = vi.spyOn(Student, "findById")
                .mockResolvedValue(null);

            const result = await getStudentByIdService("123");

            expect(spy).toHaveBeenCalledWith("123");

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Aluno(a) não encontrado(a)");
            }

        });

    });

});

describe("updateStudentService", () => {

    describe("Sucesso", () => {

        it("deve atualizar um aluno com sucesso", async () => {

            const updateData = {
                name: "João Atualizado",
            };

            const updatedStudent = {
                _id: "123",
                name: "João Atualizado",
                birthDate: new Date("2020-01-01"),
                gender: "male",
                disability: null,
                classId: "class123",
            };       

            const spy = vi.spyOn(Student, "findByIdAndUpdate")
                .mockResolvedValue(updatedStudent as any);

            const result = await updateStudentService(
                "123",
                updateData,
            );

            expect(spy).toHaveBeenCalledWith(
                "123",
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

            expect(result.error).toBe(false);

            if (!result.error) {
                expect(result.data).toEqual(updatedStudent);
            }       
        });
    });

    describe("Erros", () => {

        it("deve retornar erro quando o aluno não existir", async () => {

            const updateData = {
                name: "João Atualizado",
            };
    
            const spy = vi.spyOn(Student, "findByIdAndUpdate")
                .mockResolvedValue(null);

            const result = await updateStudentService(
                "123",
                updateData,
            );        

            expect(spy).toHaveBeenCalledWith(
                "123",
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

            expect(result.error).toBe(true);

            if (result.error) {
                expect(result.status).toBe(404);
                expect(result.message).toBe("Aluno(a) não encontrado(a)");
            }   
          });
        });

        it("não deve atualizar um aluno quando ele não existir", async () => {

            const updateData = {
                name: "João Atualizado",
            };

            const spy = vi.spyOn(Student, "findByIdAndUpdate")
                .mockResolvedValue(null);

            await updateStudentService(
                "123",
                updateData,
            );

            expect(spy).toHaveBeenCalledTimes(1);

        });
    });

describe("deleteStudentService", () => {

    describe("Sucesso", () => {

        it("deve deletar um aluno com sucesso", async () => {

            const spy = vi.spyOn(Student, "findByIdAndDelete")
                .mockResolvedValue({} as any);

            const result = await deleteStudentService("123");

            expect(spy).toHaveBeenCalledWith("123");
            expect(result.error).toBe(false);
        });
    });

    describe("Erros", () => {

        
        it("deve retornar erro quando o aluno não existir", async () => {

            const spy = vi.spyOn(Student, "findByIdAndDelete")
                .mockResolvedValue(null);

            const result = await deleteStudentService("123");

            expect(spy).toHaveBeenCalledWith("123");

            expect(result.error).toBe(true);

            if(result.error){
                expect(result.status).toBe(404);
                expect(result.message).toBe("Aluno(a) não encontrado(a)");
            }
        });  
    });     
})