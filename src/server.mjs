import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import apiRouter from './routes/index.mjs';
import { notFound, errorHandler } from './middleware/errorHandler.mjs';

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI;

console.log('🟡 Booting GymGenie backend...');
console.log('• PORT:', PORT);
console.log('• CLIENT_ORIGIN:', CLIENT_ORIGIN);
console.log('• MONGO_URI present?', Boolean(MONGO_URI));

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

async function start() {
    if (!MONGO_URI) {
        console.error('❌ Missing MONGO_URI in .env');
        process.exit(1);
    }

    try {
        console.log('🟡 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB connected');

        app.listen(PORT, () =>
            console.log(`🚀 Server listening at http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error('❌ Mongo connection error:', err?.message || err);
        console.error('ℹ️  Check that Mongo is running and MONGO_URI is correct.');
        process.exit(1);
    }
}

start();
