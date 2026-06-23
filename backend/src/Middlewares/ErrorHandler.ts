import { Request, Response, NextFunction } from 'express';


const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.error("Backend error:", err);
  // If the status code is 200, but an error was thrown, default it to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default ErrorHandler
