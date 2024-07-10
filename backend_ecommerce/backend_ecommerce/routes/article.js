// routes/article.js
import express from 'express';
import { verifieToken } from '../auth.js';
import {
  add,
  getAll,
  getById,
  updateById,
  deleteById,
  getByAsc,
  getByDesc,
  getByUser,
  getReview
} from "../controllers/article.controller.js";


const router = express.Router();
router.post('/', verifieToken, add);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', verifieToken, updateById);
router.delete('/:id', verifieToken, deleteById);
router.get('/sort/asc', getByAsc);
router.get('/sort/desc', getByDesc);
router.get('/user/articles', verifieToken, getByUser);
router.get('/:id/avis', getReview);
export default router;