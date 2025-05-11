import express from 'express';
import path from 'path';
import multer from "multer";
import { getAllJournals, createJournal, 
    getJournalById, deleteJournal,updateJournal,memory } from '../controller/journalController.js';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
const router = express.Router();

router.get('/memories', memory);
router.get('/',getAllJournals);
router.post('/', upload.single('imageUrl'), createJournal);
router.get('/:id',getJournalById);
router.delete('/:id',deleteJournal);
router.put('/:id',updateJournal);


export default router;
