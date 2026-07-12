import { vi } from "vitest";
import { createFindChain } from ".";
import { Performance } from "../../modules/performances/performances.model";
import { Student } from "../../modules/students/students.model";

export const setupPerformanceListMocks = (performances: any[]) => {

    const mocks = createFindChain(performances);

    const findMock = vi.spyOn(Performance, "find")
        .mockReturnValue(mocks.chain as any);

    const countMock = vi.spyOn(Performance, "countDocuments")
        .mockResolvedValue(performances.length);

    return {
        ...mocks,
        findMock,
        countMock,
    };
};

export const setupStudentExists = (student: any = {}) => {
    vi.spyOn(Student, "findById")
        .mockResolvedValue(student);
};