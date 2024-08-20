import { Response } from "express";

export default function responseBuilder(
  response: Response,
  json: {
    ok: boolean;
    statusCode: number;
    message: string;
    data?: Object | Array<any>;
    pagination?: {
      totalPage: number;
      currentPage: number;
      prevPage: number | null;
      nextPage: number | null;
      totalData: number;
    };
  }
) {
  response.status(json.statusCode).json({
    ok: json.ok,
    statusCode: json.statusCode,
    message: json.message,
    data: json.data || {},
    pagination: json.pagination || {},
  });
}
