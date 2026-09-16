import { Router } from 'express';
import { register, login, refresh, logout, logoutAll, changePassword } from '../controllers/auth.controller';
import { validateResource } from '../middlewares/validateResource';
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from '../schemas/auth.schema';
import { requireUser } from '../middlewares/requireUser';
import { loginRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', validateResource(registerSchema), register);
router.post('/login', loginRateLimiter, validateResource(loginSchema), login);
router.post('/refresh', validateResource(refreshTokenSchema), refresh);

router.post('/logout', requireUser, logout);
router.post('/logout-all', requireUser, logoutAll);
router.post('/change-password', requireUser, validateResource(changePasswordSchema), changePassword);

export default router;
