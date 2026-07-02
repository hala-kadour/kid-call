import express from 'express';
import { addKid, getKidsOf, callKid , confirmKid} from './kids.js';
import { validateAddingKid, validateGetKidsOf, validateCall , validateConfirmKid} from './validators.js';

export const router = express.Router();

router.post('/', validateAddingKid, addKid);

router.patch('/:id/confirm', validateConfirmKid, confirmKid);

router.get('/:id', validateGetKidsOf, getKidsOf);

router.post('/:id/call', validateCall, callKid);
