// src/routes/journalRoutes.js
import express from 'express';
import { getAllJournals, createJournal, getJournalById } from '../controller/journalController.js';
const router = express.Router();

// Get all journals (protected route)
router.get('/',getAllJournals);

// Create a new journal (protected route)
router.post('/',createJournal);
router.get('/:id',getJournalById);
export default router;
