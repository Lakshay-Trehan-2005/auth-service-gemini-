import { Router } from 'express';
import { requireUser } from '../middlewares/requireUser';
import { requireRole } from '../middlewares/requireRole';
import { getSessions, revokeSession, getAllUsersAdmin, systemPing } from '../controllers/user.controller';

const router = Router();

router.use(requireUser);

router.get('/sessions', getSessions);
router.delete('/sessions/:sessionId', revokeSession);
router.get('/ping', systemPing);

// Admin only route
router.get('/admin/users', requireRole(['admin']), getAllUsersAdmin);

export default router;
