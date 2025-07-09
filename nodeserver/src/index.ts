import express from 'express';
import dotenv from 'dotenv';
import articlesRoutes from './routes/articleRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/', articlesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
