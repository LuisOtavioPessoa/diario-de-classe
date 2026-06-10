import { Performance, PerformanceDocument } from "./performances.model";
import { Student } from "../students/students.model";
import { Class } from "../classes/classes.model";
import { PaginatedResponse, ServiceResponse } from "../../types/service.types";

type PerformancesFilter = {
    studentId: string;
    year?: number;
    month?: number;
    description?: {
        $regex: string;
        $options: string;
    };
};

export const createPerformanceService = async (
    studentId: string,
    classId: string,
    month: number,
    year: number,
    description: string,
): Promise<ServiceResponse<PerformanceDocument>> => {

    const classExists = await Class.findById(classId);

    if (!classExists) {
        return {
            error: true,
            status: 404,
            message: "Turma não encontrada",
        };
    }

    const student = await Student.findById(studentId);

    if (!student) {
        return {
            error: true,
            status: 404,
            message: "Aluno(a) não encontrado(a)",
        };
    }

    if (student.classId.toString() !== classId) {
        return {
            error: true,
            status: 400,
            message: "O aluno(a) não pertence à turma informada.",
        };
    }

    const performanceExists = await Performance.findOne({
        studentId,
        month,
        year,
    });

    if (performanceExists) {
        return {
            error: true,
            status: 409,
            message:
                "Já existe um desempenho para esse aluno nesse mês e ano",
        };
    }

    const performance = await Performance.create({
        studentId,
        classId,
        month,
        year,
        description,
    });

    return {
        error: false,
        data: performance,
    };
};

export const listPerformancesByStudentService = async (
    studentId: string,
    page: number,
    limit: number,
    year?: number,
    month?: number,
    search?: string,
): Promise<PaginatedResponse<PerformanceDocument>> => {

    const filter: PerformancesFilter = { 
        studentId,
    };

    if(search?.trim()) {
        filter.description = {
            $regex: search.trim(),
            $options: "i",
        };
    }

    if(year) {
        filter.year = year;
    }

    if(month) {
        filter.month = month;
    }
    
    const student = await Student.findById(studentId);

    if (!student) {
        return {
            error: true,
            status: 404,
            message: "Aluno(a) não encontrado(a)",
        };
    }

    const skip = (page - 1) * limit;

    const [performances, total] = await Promise.all([
        Performance.find(filter)
            .sort({
                year: -1,
                month: -1,
            })
            .skip(skip)
            .limit(limit),

        Performance.countDocuments(filter),
    ]);

    return {
        error: false,
        data: performances,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getPerformanceByMonthService = async (
    studentId: string,
    month: number,
    year: number,
): Promise<ServiceResponse<PerformanceDocument>> => {

    const student = await Student.findById(studentId);

    if (!student) {
        return {
            error: true,
            status: 404,
            message: "Aluno(a) não encontrado(a)",
        };
    }

    const performance = await Performance.findOne({
        studentId,
        month,
        year,
    });

    if (!performance) {
        return {
            error: true,
            status: 404,
            message: "Desempenho não encontrado",
        };
    }

    return {
        error: false,
        data: performance,
    };
};

export const updatePerformanceService = async (
    id: string,
    description: string,
): Promise<ServiceResponse<PerformanceDocument>> => {

    const performanceUpdated =
        await Performance.findByIdAndUpdate(
            id,
            {
                description,
            },
            {
                new: true,
                runValidators: true,
            },
        );

    if (!performanceUpdated) {
        return {
            error: true,
            status: 404,
            message: "Desempenho não encontrado",
        };
    }

    return {
        error: false,
        data: performanceUpdated,
    };
};

export const deletePerformanceService = async (
    id: string,
): Promise<ServiceResponse> => {

    const performanceDeleted =
        await Performance.findByIdAndDelete(id);

    if (!performanceDeleted) {
        return {
            error: true,
            status: 404,
            message: "Desempenho não encontrado",
        };
    }

    return {
        error: false,
        data: undefined,
    };
};