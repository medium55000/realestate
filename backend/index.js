import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.get('/api/health', (req, res) => res.json({ ok: true, port: PORT }));
app.use('/api/user', userRoute);
app.use('/api/residency', residencyRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS allowed for: ${CORS_ORIGIN}`);
});
