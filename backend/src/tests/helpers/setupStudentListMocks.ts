import { vi } from "vitest";
import { Class } from "../../modules/classes/classes.model";
import { Student } from "../../modules/students/students.model";
import { fakeOwnedClass } from "../mocks/class";

export const setupStudentListMocks = (students: any[]) => {

    vi.spyOn(Class, "findById")
        .mockResolvedValue(fakeOwnedClass() as any);

    const mocks = createFindChain(students);

    const findMock = vi.spyOn(Student, "find")
        .mockReturnValue(mocks.chain as any);

    const countMock = vi.spyOn(Student, "countDocuments")
        .mockResolvedValue(students.length);

    return {
        ...mocks,
        findMock,
        countMock,
    };
};

export const createFindChain = <T>(result: T) => {

    const limitMock = vi.fn().mockResolvedValue(result);

    const skipMock = vi.fn().mockReturnValue({
        limit: limitMock,
    });

    const sortMock = vi.fn().mockReturnValue({
        skip: skipMock,
    });

    return {
        sortMock,
        skipMock,
        limitMock,

        chain: {
            sort: sortMock,
        },
    };
};
