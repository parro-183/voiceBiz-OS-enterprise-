import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware
app.use(helmet());

// CORS
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to voiceBiz-OS-enterprise',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

app.get('/api/v1/status', (req: Request, res: Response) => {
  res.json({
    service: 'voiceBiz-OS-enterprise',
    status: 'running',
    apiVersion: 'v1',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

// Start server
const server = app.listen(PORT, HOST as string, () => {
  console.log(`
    ╔═══════════════════════════════════════╗
    ║   voiceBiz-OS-enterprise v1.0.0       ║
    ╠═══════════════════════════════════════╣
    ║   🚀 Server running                   ║
    ║   📍 http://${HOST}:${PORT}
    ║   🌐 Environment: ${process.env.NODE_ENV || 'development'}
    ╚═══════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
