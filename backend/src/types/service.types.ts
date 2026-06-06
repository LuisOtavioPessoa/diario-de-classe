export type ServiceError = {
    error: true;
    status: number;
    message: string;
};

export type ServiceSuccess<T> = {
    error: false;
    data: T;
};

export type ServiceResponse<T = undefined> =
    | ServiceError
    | ServiceSuccess<T>;

export interface PaginationMetadata {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export type PaginatedResponse<T> =
    | ServiceError
    | {
          error: false;
          data: T[];
          pagination: PaginationMetadata;
      };