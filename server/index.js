import express from 'express';
import cors from 'cors';
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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/api/orders', ordersRouter);

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
  res.status(500).json({ error: 'Internal server error' });
});

function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, '0.0.0.0', () => {
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
startServer(PORT).then(() => {
  // Server started successfully
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  closeDatabase().then(() => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
  
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;