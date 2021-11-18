import * as express from 'express';
import overviewController from './controllers/overview';

const router = express.Router();

router.get('/', overviewController.overviewPage);

export default router;
