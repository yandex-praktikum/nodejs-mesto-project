import type { NextFunction, Request, Response } from 'express';
import Card, { type ICard } from '../models/card';
import type { AuthenticatedRequest } from '../types/request';
import ErrorHandler from '../errors/errors';

export function createCard(req: Request, res: Response, next: NextFunction) {
  const { name, link }: ICard = req.body;

  return Card.create({
    name,
    link,
    owner: (req as AuthenticatedRequest).user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      const error = ErrorHandler.from(
        err,
        'Переданы некорректные данные при создании карточки',
      );

      return next(error);
    });
}

export function getAllCards(_req: Request, res: Response, next: NextFunction) {
  return Card.find()
    .then((card) => res.send(card))
    .catch(() => {
      const error = new ErrorHandler();
      return next(error);
    });
}

export function deleteCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorHandler(
          'Карточка с указанным _id не найдена',
          'NotFound',
        );
      }

      return res.send({ message: `Карточка ${card.name} - удалена` });
    })
    .catch((err) => {
      const error = ErrorHandler.from(err, 'Передан некорректный _id карточки');

      return next(error);
    });
}

export function likeCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: (req as AuthenticatedRequest).user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorHandler(
          'Передан несуществующий _id карточки',
          'NotFound',
        );
      }

      return res.send({ message: 'like' });
    })
    .catch((err) => {
      const error = ErrorHandler.from(
        err,
        'Переданы некорректные данные для постановки лайка',
      );

      return next(error);
    });
}

export function dislikeCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: (req as AuthenticatedRequest).user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorHandler(
          'Передан несуществующий _id карточки',
          'NotFound',
        );
      }

      return res.send({ message: 'dislike' });
    })
    .catch((err) => {
      const error = ErrorHandler.from(
        err,
        'Переданы некорректные данные для снятии лайка',
      );

      return next(error);
    });
}
