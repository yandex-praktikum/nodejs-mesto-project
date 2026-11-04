import type { NextFunction, Request, Response } from 'express';
import User, { type IUser } from '../models/user';
import type { AuthenticatedRequest } from '../types/request';
import ErrorHandler from '../errors/errors';

export function getAllUsers(_req: Request, res: Response, next: NextFunction) {
  return User.find()
    .then((users) => res.send(users))
    .catch(() => {
      const error = new ErrorHandler();
      return next(error);
    });
}

export function getUserById(req: Request, res: Response, next: NextFunction) {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorHandler(
          'Пользователь по указанному _id не найден',
          'NotFound',
        );
      }

      return res.send(user);
    })
    .catch((err) => {
      const error = ErrorHandler.from(err, 'Передан некорректный _id');

      return next(error);
    });
}

export function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, about, avatar }: IUser = req.body;

  return User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      const error = ErrorHandler.from(
        err,
        'Переданы некорректные данные при создании пользователя',
      );

      return next(error);
    });
}

// Универсальная функция для обнволения переданных данных
function updateUserData(req: Request, dataUpdate: Partial<IUser>) {
  return User.findByIdAndUpdate(
    (req as AuthenticatedRequest).user._id,
    dataUpdate,
    {
      new: true,
      runValidators: true,
    },
  ).then((user) => {
    if (!user) {
      throw new ErrorHandler(
        'Пользователь с указанным _id не найден',
        'NotFound',
      );
    }

    return user;
  });
}

export function updateUser(req: Request, res: Response, next: NextFunction) {
  const { name, about, avatar }: IUser = req.body;

  const dataUpdate: Partial<IUser> = req.body;

  // Проверяем на то, что тело не пустое
  if (Object.keys(dataUpdate).length === 0) {
    return next(
      new ErrorHandler(
        'Переданы некорректные данные при обновлении профиля',
        'ValidationError',
      ),
    );
  }

  return updateUserData(req, { name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      const error = ErrorHandler.from(
        err,
        'Переданы некорректные данные при обновлении профиля',
      );

      return next(error);
    });
}

export function updateUserAvatar(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { avatar }: Pick<IUser, 'avatar'> = req.body;

  const dataUpdate: Partial<IUser> = req.body;

  // Проверяем на то, что тело не пустое
  if (Object.keys(dataUpdate).length === 0) {
    return next(
      new ErrorHandler(
        'Переданы некорректные данные при обновлении аватара',
        'ValidationError',
      ),
    );
  }

  return updateUserData(req, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      const error = ErrorHandler.from(
        err,
        'Переданы некорректные данные при обновлении профиля',
      );

      return next(error);
    });
}
