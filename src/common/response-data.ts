// src/common/response-data.ts
export class ResponseData<T> {
  data: T | null;
  statusCode: number;
  message: string;

  constructor(data: T | null, statusCode = 200, message = 'Success') {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }
}
