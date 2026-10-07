const http = require('http');

const PORT = process.env.PORT || 3000;

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KaamDost Native Android Apps</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      max-width: 520px;
      width: 100%;
      padding: 2.5rem 2rem;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 800;
      margin-bottom: 1.25rem;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }
    p.sub {
      color: #94a3b8;
      font-size: 0.92rem;
      margin-bottom: 2rem;
      line-height: 1.5;
    }
    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.1rem 1.25rem;
      border-radius: 16px;
      text-decoration: none;
      font-weight: 800;
      color: #ffffff;
      text-align: left;
      transition: transform 0.2s;
    }
    .btn:active { transform: scale(0.98); }
    .btn-cust {
      background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
      box-shadow: 0 4px 20px rgba(234, 88, 12, 0.35);
    }
    .btn-work {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      box-shadow: 0 4px 20px rgba(22, 163, 74, 0.35);
    }
    .btn-icon {
      font-size: 1.5rem;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .btn-title { font-size: 1.05rem; line-height: 1.2; }
    .btn-desc { font-size: 0.78rem; opacity: 0.9; font-weight: 500; margin-top: 2px; }
    .footer-link {
      color: #38bdf8;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">● SERVICE OPERATIONAL & HEALTHY</div>
    <h1>KaamDost Native</h1>
    <p class="sub">React Native Mobile Applications for Telangana Daily Wage Marketplace</p>

    <div class="btn-group">
      <a href="https://kaamdost.onrender.com/download-customer-apk" class="btn btn-cust">
        <div class="btn-icon">👤</div>
        <div>
          <div class="btn-title">KaamDost Customer App</div>
          <div class="btn-desc">Download Android APK for Customers</div>
        </div>
      </a>

      <a href="https://kaamdost.onrender.com/download-worker-apk" class="btn btn-work">
        <div class="btn-icon">👷</div>
        <div>
          <div class="btn-title">KaamDost Partner App</div>
          <div class="btn-desc">Download Android APK for Workers</div>
        </div>
      </a>
    </div>

    <div>
      <a href="https://kaamdost.onrender.com" class="footer-link">← Open KaamDost Web Portal</a>
    </div>
  </div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  if (req.url === '/api/health' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'kaamdost-native', time: new Date().toISOString() }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`KaamDost Native server listening on port ${PORT}`);
});
