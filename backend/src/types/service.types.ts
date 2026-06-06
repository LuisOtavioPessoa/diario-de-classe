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