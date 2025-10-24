import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.DATABASE_URL;

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`CORS Blocked: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ===== Routes =====
app.get('/api/health', (req, res) => res.json({ ok: true, port: PORT }));
app.use('/api/user', userRoute);
app.use('/api/residency', residencyRoute);

// ===== DB & Server =====
const startServer = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 7000,
      socketTimeoutMS: 20000,
      retryWrites: true,
      w: 'majority',
    });
    console.log('MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`CORS allowed for: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();

// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import { userRoute } from './routes/userRoute.js';
// import { residencyRoute } from './routes/residencyRoute.js';

// dotenv.config();
// const app = express();

// const PORT = process.env.PORT || 3000;
// // const CORS_ORIGIN = process.env.CORS_ORIGIN;
// //const CORS_ORIGIN = process.env.CORS_ORIGIN.split(',');
// const allowedOrigins = (process.env.CORS_ORIGIN || '')
//   .split(',')
//   .map((s) => s.trim())
//   .filter(Boolean);

// app.use(express.json());
// app.use(cookieParser());
// // app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, origin);
//       } else {
//         console.warn(`CORS Blocked: ${origin}`);
//         return callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// app.get('/api/health', (req, res) => res.json({ ok: true, port: PORT }));
// app.use('/api/user', userRoute);
// app.use('/api/residency', residencyRoute);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   // console.log(`CORS allowed for: ${CORS_ORIGIN}`);
//   console.log(`CORS allowed for: ${allowedOrigins.join(', ')}`);
// });
