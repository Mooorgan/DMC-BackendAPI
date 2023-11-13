import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ERROR, sendResponse } from './controller.helper-functions';

export const get404 = (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(404).json(sendResponse(ERROR, 'page not found'));
};

export const get500 = (
  //   error: ErrorRequestHandler,
  error: any,
  req: Request,
  response: Response,
  next: NextFunction
) => {
  response
    .status(error.httpStatusCode)
    .json(sendResponse(ERROR, error.message));
};
