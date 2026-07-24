import { verificarAuth } from '../middlewares/auth.middleware.js';

router.get('/restaurants', verificarAuth, getRestaurantes);