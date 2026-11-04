import express from 'express';
import mongoose from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import type { AuthenticatedRequest } from './types/request';
import ErrorHandler from './errors/errors';

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as AuthenticatedRequest).user = {
    _id: '6ae9eebdebc67517bc66643e',
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new ErrorHandler('Маршрут не найден', 'NotFound');

  return next(error);
});

app.use(
  (err: ErrorHandler, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode).send({ message: err.message });
  },
);

app.listen(3000);
