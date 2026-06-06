import { Class, ClassDocument } from "./classes.model";
import { ServiceResponse } from "../../types/service.types";

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
    userId: string
): Promise<ClassDocument[]> => {

    const classes = await Class.find({
        userId,
    }).sort({
        year: -1,
        name: 1,
    });

    return classes;
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