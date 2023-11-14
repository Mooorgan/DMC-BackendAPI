import { Task } from '../models/task.model';
import { NextFunction, Request, Response } from 'express';
import {
  ERROR,
  SUCCESS,
  catchError,
  sendResponse,
} from './controller.helper-functions';

export const createTask = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const task: any = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    creator: req.userData.userId,
    username: req.userData.username,
  });
  try {
    const createdTask = await task.save();
    res
      .status(201)
      .json(sendResponse(SUCCESS, 'Task successfully created', createdTask));
  } catch (err) {
    catchError(next, err, 500, 'Creating a task failed.');
  }
};

export const updateTask = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const task = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    creator: req.userData.userId,
    username: req.userData.username,
  };

  try {
    const updatedResult = await Task.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      task
    );
    if (updatedResult.matchedCount > 0) {
      res.status(200).json(sendResponse(SUCCESS, 'Task successfully updated'));
    } else {
      res
        .status(401)
        .json(sendResponse(ERROR, 'Not authorized to update task'));
    }
  } catch (err) {
    catchError(next, err, 500, 'Updating a task failed.');
  }
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageSizeString = req.query.pageSize;
  const currentPageString = req.query.page;
  try {
    const taskQuery = Task.find();
    if (pageSizeString && currentPageString) {
      const pageSize = +pageSizeString;
      const currentPage = +currentPageString;
      taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    const documents = await taskQuery.exec();
    const count = await Task.countDocuments();
    const responseToBeSent = {
      tasks: documents,
      maxTasks: count,
    };
    res
      .status(200)
      .json(
        sendResponse(SUCCESS, 'Tasks successfully fetched', responseToBeSent)
      );
  } catch (err) {
    catchError(next, err, 500, 'Fetching all tasks failed.');
  }
};

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res
        .status(200)
        .json(
          sendResponse(
            SUCCESS,
            'Specified single task successfully fetched',
            task
          )
        );
    } else {
      res
        .status(404)
        .json(sendResponse(ERROR, 'Specified single task not found'));
    }
  } catch (err) {
    catchError(next, err, 500, 'Fetching specified single task failed.');
  }
};

export const deleteTask = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteResult = await Task.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId,
    });
    if (deleteResult.deletedCount > 0) {
      res
        .status(200)
        .json(
          sendResponse(SUCCESS, 'Deleting the specified single task succeeded')
        );
    } else {
      res
        .status(401)
        .json(
          sendResponse(
            ERROR,
            'Not authorized to delete this specified single task'
          )
        );
    }
  } catch (err) {
    catchError(next, err, 500, 'Deleting specified single task failed.');
  }
};
