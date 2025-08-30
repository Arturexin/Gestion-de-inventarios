import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller';

const router = Router();

router.get('/getCategories', getCategories)
router.post('/createCategory', createCategory)
router.patch('/updateCategory', updateCategory)
router.patch('/deleteCategory', deleteCategory)

export default router;