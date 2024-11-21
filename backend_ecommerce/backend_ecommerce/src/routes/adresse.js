import express from 'express';
import * as AddressController from '../controllers/adresse.controller.js';
import { verifieToken } from '../auth.js';

const router = express.Router();

router.post('/addresses', verifieToken, AddressController.add);
router.get('/addresses', verifieToken, AddressController.getAllByUser);
router.get('/addresses/:id', verifieToken, AddressController.getById);
router.put('/addresses/:id', verifieToken, AddressController.updateById);
router.delete('/addresses/:id', verifieToken, AddressController.deleteById);

export default router;
