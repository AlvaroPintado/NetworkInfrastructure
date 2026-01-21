const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const app = express();
app.use(bodyParser.json());

// — Token-bucket: 5 peticiones / 1s (solo ráfagas) —
const burstLimiter = new RateLimiterMemory({
  points: process.env.BUCKET_POINTS || 5,     // 5 tokens (peticiones) por IP
  duration: process.env.BUCKET_DURATION || 1,   // ventana de 1 segundo
  blockDuration: 0, // no bloquea más allá de la ráfaga
});

const blockedIPs = new Set([
  '10.0.4.29'
]);

const TARGET_HOST = 'haproxy';
const TARGET_PORT = 80;

// Middleware global para token-bucket
app.use(async (req, res, next) => {
  const ip = req.ip;
  try {
    // Consume 1 token; si no hay, lanza excepción
    await burstLimiter.consume(ip);
    return next();
  } catch (rej) {
    const retrySecs = Math.ceil((rej.msBeforeNext || 0) / 1000);
    res
      .status(429)
      .set('Retry-After', String(retrySecs))
      .send(`Too Many Requests. Try in ${retrySecs}s`);
  }
});

app.use((req, res, next) => {
  if (blockedIPs.has(req.ip)) {
    res.status(403).send('Access deny');
  } else {
    next();
  }
});

function proxyRequest(req, res) {
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      'X-Forwarded-For': req.ip,
      'X-Rate-Limited': 'true',
      'host': TARGET_HOST
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    
    Object.keys(proxyRes.headers).forEach(key => {
      if (key.toLowerCase() !== 'transfer-encoding') {
        res.set(key, proxyRes.headers[key]);
      }
    });

    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    if (!res.headersSent) {
      res.status(500).send('Proxy error');
    }
  });

  proxyReq.setTimeout(30000, () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.status(504).send('Gateway Timeout');
    }
  });

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }

  proxyReq.end();
}

app.get('/ping', (req, res) => {
  res.status(200).send('Middleware Token Bucket service root');
});

app.use('/', (req, res) => {
  proxyRequest(req, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Instance ID: ${process.env.HOSTNAME || 'local'}`);
});