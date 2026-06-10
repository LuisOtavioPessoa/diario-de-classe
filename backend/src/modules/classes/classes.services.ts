import { Class, ClassDocument } from "./classes.model";
import { PaginatedResponse, ServiceResponse } from "../../types/service.types";

type ClassesFilter = {
    userId: string;

    name?: {
        $regex: string;
        $options: string;
    };

    year?: number;
};

export const createClassService = async (
    name: string,
    year: number,
    userId: string,
): Promise<ServiceResponse<ClassDocument>> => {

    const classExists = await Class.findOne({
        name,
        year,
        userId,
    });

    if(classExists) {
        return {
            error: true,
            status: 409,
            message: "Já existe uma turma com esse nome nesse ano",
        };
    }

    const classCreated = await Class.create({
        name,
        year,
        userId,
    });

    return {
        error: false,
        data: classCreated,
    };
};

export const listClassesService = async (
    userId: string,
    page: number,
    limit: number,
    search?: string,
    year?: number,
): Promise<PaginatedResponse<ClassDocument>> => {

    const filter: ClassesFilter = { 
        userId,
    };

    if(search?.trim()) {
        filter.name = {
            $regex: search.trim(),
            $options: "i",
        };
    }

    if(year) {
        filter.year = year;
    }

    const skip = (page - 1) * limit;

    const [classes, total] = await Promise.all([
        Class.find(filter)
            .sort({
                year: -1,
                name: 1,
            })
            .skip(skip)
            .limit(limit),

        Class.countDocuments(filter),
    ]);

    return {
        error: false,
        data: classes,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const deleteClassService = async (
    id: string
): Promise<ServiceResponse> => {

    const classDeleted = await Class.findByIdAndDelete(id);

    if(!classDeleted){
        return {
            error: true,
            status: 404,
            message: "Turma não encontrada",
        };
    }

    return {
        error: false,
        data: undefined,
    };
};