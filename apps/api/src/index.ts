import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables before other imports use process.env
dotenv.config();

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import supabase from './db/supabase';

const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- ADDED ROUTES ---

// 1. Root Route (This fixes the "Cannot GET /" error)
app.get('/', (req: Request, res: Response) => {
  res.send('SahiDawa-India API is running successfully!');
});

// 2. Health Check Route — verifies Supabase DB connectivity
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Run a lightweight test query to confirm DB connection is alive
    const { error } = await supabase
      .from('medicines')
      .select('id')
      .limit(1);

    if (error) {
      return res.status(503).json({
        status: 'degraded',
        db: 'unreachable',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    return res.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({
      status: 'error',
      db: 'unreachable',
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`[API Server]: SahiDawa API is running at http://localhost:${port}`);
});
