import express from 'express';
import Tip from '../models/Tip.js';

const router = express.Router();


router.get('/random', async (req, res) => {
  try {
    const randomTip = await Tip.aggregate([{ $sample: { size: 1 } }]);
    res.json(randomTip[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tip', error: err.message });
  }
});

export default router;
