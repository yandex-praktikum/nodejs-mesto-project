const errorStatusCode: Record<string, number> = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
};

type ErrorName = 'CastError' | 'ValidationError' | 'NotFound' | 'ServerError';

export default class ErrorHandler extends Error {
  statusCode: number;

  constructor(
    message = 'На сервере произошла ошибка',
    errorName: ErrorName = 'ServerError',
  ) {
    super(message);

    this.name = errorName;
    this.statusCode = ErrorHandler.getStatusCode(errorName);
  }

  static from(
    error: unknown,
    message = 'На сервере произошла ошибка',
  ): ErrorHandler {
    // Уже подготовленную ошибку не преобразуем повторно.
    if (error instanceof ErrorHandler) {
      return error;
    }

    // Превращаем ошибку Mongoose в понятный ответ
    const errorName = error instanceof Error ? error.name : '';

    if (errorName === 'CastError') {
      return new ErrorHandler(message, 'CastError');
    }

    if (errorName === 'ValidationError') {
      return new ErrorHandler(message, 'ValidationError');
    }

    // При неизвестных ошибках выдаем статус 500
    return new ErrorHandler('На сервере произошла ошибка');
  }

  private static getStatusCode(errorName: ErrorName): number {
    if (errorName === 'NotFound') {
      return errorStatusCode.NOT_FOUND;
    }

    if (errorName === 'CastError' || errorName === 'ValidationError') {
      return errorStatusCode.BAD_REQUEST;
    }

    return errorStatusCode.SERVER_ERROR;
  }
}
