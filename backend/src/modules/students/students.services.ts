import { Student } from "./students.model";
import { Class } from "../classes/classes.model";
import { ServiceResponse } from "../../types/service.types";
import { IStudent , StudentDocument} from "./students.model";

export const createStudentService = async (
    name: string,
    birthDate: Date,
    gender: "male" | "female",
    disability: string | null | undefined,
    classId: string,
    userId: string,
): Promise<ServiceResponse<StudentDocument>> => {

    const classExists = await Class.findById(classId);

    if(!classExists){
        return {
            error: true,
            status: 404,
            message: "Turma não encontrada",
        };
    }

    if(classExists.userId.toString() !== userId){
        return {
            error: true,
            status: 403,
            message: "Acesso negado",
        };
    }

    const student = await Student.create({
        name,
        birthDate,
        gender,
        disability,
        classId,
    });

    return {
        error: false,
        data: student,
    };
};

export const listStudentsByClassService = async (
    classId: string,
    userId: string,
): Promise<ServiceResponse<StudentDocument[]>> => {

    const classExists = await Class.findById(classId);

    if(!classExists) {
        return {
            error: true,
            status: 404,
            message: "Turma não encontrada",
        };
    }

    if(classExists.userId.toString() !== userId){
        return {
            error: true,
            status: 403,
            message: "Acesso negado",
        };
    }

    const students = await Student.find({
        classId,
    }).sort({
        name: 1,
    });

    return {
        error: false,
        data: students,
    };
};

export const getStudentByIdService = async (
    id: string,
): Promise<ServiceResponse<StudentDocument>> => {

    const student = await Student.findById(id);

    if(!student){
        return {
            error: true,
            status: 404,
            message: "Aluno(a) não encontrado(a)",
        };
    }

    return {
        error: false,
        data: student,
    };
};

export const updateStudentService = async (
    id: string,
    data: Partial<IStudent>,
): Promise<ServiceResponse<StudentDocument>> => {

    const updateStudent = await Student.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

    if(!updateStudent){
        return {
            error: true,
            status: 404,
            message: "Aluno(a) não encontrado(a)",
        };
    }

    return {
        error: false,
        data: updateStudent,
    };
};

export const deleteStudentService = async (
    id: string,
): Promise<ServiceResponse> => {
     
    const deletedStudent = await Student.findByIdAndDelete(id);

    if(!deletedStudent){
        return {
            error: true,
            status: 404,
            message: "Aluno(a) não encontrado(a)",
        };
    }

    return {
        error: false,
        data: undefined,
    };
};