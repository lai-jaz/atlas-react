import express from 'express';
import { getAllJournals, createJournal, getJournalById } from '../controller/journalController.js';
const router = express.Router();
router.get('/',getAllJournals);
router.post('/',createJournal);
router.get('/:id',getJournalById);
export default router;
