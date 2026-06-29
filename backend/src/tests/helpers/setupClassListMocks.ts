import { vi } from "vitest";
import { createFindChain } from ".";
import { Class } from "../../modules/classes/classes.model";

/**
 * Configura todos os mocks necessários para os testes
 * de listClassesService.
 */
export const setupClassListMocks = (classes: any[]) => {

    const mocks = createFindChain(classes);

    const findMock = vi.spyOn(Class, "find")
        .mockReturnValue(mocks.chain as any);

    const countMock = vi.spyOn(Class, "countDocuments")
        .mockResolvedValue(classes.length);

    return {
        ...mocks,
        findMock,
        countMock,
    };
};