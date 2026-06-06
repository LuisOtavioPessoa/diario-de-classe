export type ServiceResponse<T = undefined> =
    | {
          error: true;
          status: number;
          message: string;
      }
    | {
          error: false;
          data: T;
      };

export interface PaginationMetadata {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMetadata;
}