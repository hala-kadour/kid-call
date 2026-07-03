import express from 'express';
import { addKid, getKidsOf, getAllKids, callKid, confirmKid } from './kids.js';
import { validateAddingKid, validateGetKidsOf, validateGetAllKids, validateCall, validateConfirmKid } from './validators.js';

export const router = express.Router();

router.post('/', validateAddingKid, addKid);

router.get('/admin/all', validateGetAllKids, getAllKids);

router.patch('/:id/confirm', validateConfirmKid, confirmKid);

router.get('/:id', validateGetKidsOf, getKidsOf);

router.post('/:id/call', validateCall, callKid);