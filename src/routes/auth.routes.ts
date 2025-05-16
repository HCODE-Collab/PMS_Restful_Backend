
import { Router } from 'express';
import { validationMiddleware } from '../middleware/validator.middleware';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { checkLoggedIn } from '../middleware/auth.middleware';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
const router = Router();

router.post('/register', validationMiddleware(RegisterDto), asyncHandler(AuthController.register));
router.post('/login', validationMiddleware(LoginDto), asyncHandler(AuthController.login));
router.get('/me', checkLoggedIn, asyncHandler(AuthController.getCurrentUser));

export default router;
