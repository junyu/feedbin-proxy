const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 简单保护：Bearer Token
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'your-secret-token';
const FEEDBIN_BASE = 'https://api.feedbin.com/v2';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// 健康检查
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'feedbin-proxy' });
});

// 代理 Feedbin API
app.all('/feedbin/*', authMiddleware, async (req, res) => {
  const feedbinPath = req.path.replace('/feedbin', '');
  const feedbinAuth = req.headers['x-feedbin-auth']; // 格式: email:password
  
  if (!feedbinAuth) {
    return res.status(400).json({ error: 'Missing X-Feedbin-Auth header' });
  }
  
  try {
    const response = await axios({
      method: req.method,
      url: `${FEEDBIN_BASE}${feedbinPath}`,
      auth: {
        username: feedbinAuth.split(':')[0],
        password: feedbinAuth.split(':')[1]
      },
      params: req.query,
      data: req.body,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Feedbin proxy running on port ${PORT}`);
});
