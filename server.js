// Local development server để test backend
// Chạy: node server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import handlers
import healthHandler from './api/health.js';
import saveHandler from './api/groups/save.js';
import getGroupHandler from './api/groups/getGroup.js';
import removeProfileHandler from './api/groups/removeProfile.js';

// Wrapper để convert Vercel handler format sang Express
const vercelToExpress = (handler) => {
  return async (req, res) => {
    // Convert Express req/res to Vercel format
    const vercelReq = {
      method: req.method,
      url: req.url,
      body: req.body,
      query: req.query,
      headers: req.headers
    };
    
    const vercelRes = {
      status: (code) => {
        res.status(code);
        return vercelRes;
      },
      json: (data) => {
        res.json(data);
      }
    };

    try {
      await handler(vercelReq, vercelRes);
    } catch (error) {
      console.error('Handler error:', error);
      res.status(500).json({ error: error.message });
    }
  };
};

// Routes
app.get('/api/health', vercelToExpress(healthHandler));

app.post('/api/groups/save', vercelToExpress(saveHandler));

app.post('/api/groups/removeProfile', vercelToExpress(removeProfileHandler));

app.get('/api/groups/:groupId', (req, res) => {
  // Convert Express params to query for Vercel handler
  const originalQuery = req.query;
  req.query = { ...originalQuery, groupId: req.params.groupId };
  vercelToExpress(getGroupHandler)(req, res);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Save endpoint: POST http://localhost:${PORT}/api/groups/save`);
  console.log(`🗑️  Remove profile: POST http://localhost:${PORT}/api/groups/removeProfile`);
  console.log(`📥 Get group: GET http://localhost:${PORT}/api/groups/:groupId`);
  console.log(`\n⚠️  Đảm bảo đã set MONGO_URI trong file .env`);
});

