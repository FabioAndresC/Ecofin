import express from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import { verifyAdmin, verifyUser } from '../utils/verifyToken';

const router = express.Router();

router.get('/', verifyAdmin, getAllUsers);
router.get('/:id', verifyUser, getUserById);

export default router;