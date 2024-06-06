import { Request, Response, NextFunction } from "express";

interface IError extends Error {
  status?: number;
}
export function errorHandler(
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err?.name);
  const message = err?.message || "Something went wrong!";
  const status = err?.status || 500;
  res.status(status).json({ success: false, error: { message } });
}
