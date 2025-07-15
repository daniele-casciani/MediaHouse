import express from 'express';
import { tokenRequired } from '../middleware/auth';
import { authorizeAccess } from '../middleware/accessControl';

const router = express.Router();

router.post('/write_article', tokenRequired, authorizeAccess('write_article'), (req, res) => {
  res.json({ message: 'Article written successfully!' });
});

router.post('/edit_article', tokenRequired, authorizeAccess('edit_article'), (req, res) => {
  res.json({ message: 'Article edited successfully!' });
});

router.get('/review_articles', tokenRequired, authorizeAccess('review_article'), (req, res) => {
  res.json({ message: 'Article review accessed successfully!' });
});

router.post('/publish_article', tokenRequired, authorizeAccess('publish_article'), (req, res) => {
  res.json({ message: 'Article published successfully!' });
});

export default router;
 