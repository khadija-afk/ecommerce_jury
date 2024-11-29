import express from 'express';
import { sendContactEmail } from '../controllers/cantacterNous.controller.js';

const router = express.Router();

// Route POST pour envoyer un email
router.post('/contact', sendContactEmail);

export default router;
