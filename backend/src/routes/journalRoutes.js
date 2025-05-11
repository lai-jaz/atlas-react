import express from 'express';
import { getAllJournals, createJournal, 
    getJournalById, deleteJournal,updateJournal,memory } from '../controller/journalController.js';
const router = express.Router();
router.get('/memories', memory);
router.get('/',getAllJournals);
router.post('/',createJournal);
router.get('/:id',getJournalById);
router.delete('/:id',deleteJournal);
router.put('/:id',updateJournal);


export default router;
