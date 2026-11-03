import { Router } from 'express';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getAllCards,
  likeCard,
} from '../controllers/cards';

const router = Router();

router.get('/cards', getAllCards);

router.post('/cards', createCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId', deleteCard);
router.delete('/cards/:cardId/likes', dislikeCard);

export default router;
