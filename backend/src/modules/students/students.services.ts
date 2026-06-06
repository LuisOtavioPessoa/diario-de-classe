import { Student } from "./students.model";
import { Class } from "../classes/classes.model";
import { PaginatedResponse, ServiceResponse } from "../../types/service.types";
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
    page: number,
    limit: number,
): Promise<PaginatedResponse<StudentDocument>> => {

    const classExists = await Class.findById(classId);

    if (!classExists) {
        return {
            error: true,
            status: 404,
            message: "Turma não encontrada",
        };
    }

    if (classExists.userId.toString() !== userId) {
        return {
            error: true,
            status: 403,
            message: "Acesso negado",
        };
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
        Student.find({
            classId,
        })
            .sort({
                name: 1,
            })
            .skip(skip)
            .limit(limit),

        Student.countDocuments({
            classId,
        }),
    ]);

    return {
        error: false,
        data: students,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
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