import { NextFunction } from 'express';
import { ResponseObject, Status } from '../types/response.type';

export const SUCCESS = 'success';
export const ERROR = 'error';

export const sendResponse = (
  status: Status,
  message: string,
  responseObject?: ResponseObject
) => {
  const responseToBeSent = {
    status,
    message,
    result: responseObject,
  };
  return responseToBeSent;
};

export const catchError = (
  next: NextFunction,
  orginalError: any,
  httpStatusCode: number,
  message: string
) => {
  const error: any = new Error(orginalError);
  error.httpStatusCode = httpStatusCode;
  error.message = message;
  return next(error);
};
