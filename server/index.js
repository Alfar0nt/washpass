import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import ordersRouter from './routes/orders.js';
import { initDatabase, closeDatabase } from './db/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize database
initDatabase().catch(console.error);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Leaflet dimuat dari CDN unpkg (dengan SRI)
      scriptSrc: ["'self'", 'https://unpkg.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      // Tile OpenStreetMap + ikon marker Leaflet (blob/data URL)
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'", 'https://nominatim.openstreetmap.org'],
    },
  },
}));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api', apiLimiter);

app.use('/api/orders', ordersRouter);

// API 404: return JSON, never fall through to SPA catch-all
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

if (NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  // Clean URL routing: map /order, /admin, /privacy, /terms to their HTML files
  const staticPages = {
    '/order': 'order.html',
    '/admin': 'admin.html',
    '/privacy': 'privacy.html',
    '/terms': 'terms.html',
  };

  Object.entries(staticPages).forEach(([route, file]) => {
    app.get(route, (req, res) => {
      res.sendFile(path.join(distPath, file));
    });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  // Multer errors are client input problems, not server faults
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

let server = null;

function startServer(port) {
  return new Promise((resolve, reject) => {
    server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${port} (${NODE_ENV})`);
      resolve(server);
    }).on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
        // Try next port automatically
        setTimeout(() => {
          startServer(port + 1).then(resolve).catch(reject);
        }, 500);
      } else {
        console.error('Server error:', error);
        reject(error);
      }
    });
  });
}

// Start server with automatic port retry
startServer(PORT).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  const forceExit = setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  closeDatabase()
    .then(() => {
      if (!server) {
        process.exit(0);
        return;
      }
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    })
    .catch((error) => {
      console.error('Error during shutdown:', error);
      process.exit(1);
    });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
