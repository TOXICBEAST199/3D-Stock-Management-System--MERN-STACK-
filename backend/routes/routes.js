import express from 'express';
import { getstocks, getstock, createstock, updatestock, deletestock } from '../controllers/stock.controller.js'; // Import controller functions as ES modules

const router = express.Router();

// Define routes
router.get('/', getstocks);
router.get('/:id', getstock);
router.post('/', createstock);
router.put('/:id', updatestock);
router.delete('/:id', deletestock);

export default router;
