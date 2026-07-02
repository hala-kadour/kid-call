import express from 'express';
import { addKid, getKidsOf, getAllKids,callKid } from './kids.js';
import { validateAddingKid, validateGetKidsOf, validateGetAllKids ,validateCall } from './validators.js';

export const router = express.Router();

router.post('/', validateAddingKid, addKid);

router.get('/admin/all', validateGetAllKids, getAllKids);

router.get('/:id', validateGetKidsOf, getKidsOf);

router.post('/:id/call', validateCall, callKid);