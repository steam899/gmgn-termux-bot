import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bot from './bot.js';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.get('/api/trending', (req, res) => {
  res.json({
    data: bot.data.trendingTokens.slice(0, 20),
    count: bot.data.trendingTokens.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/new-tokens', (req, res) => {
  res.json({
    data: bot.data.newTokens.slice(0, 20),
    count: bot.data.newTokens.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/alerts', (req, res) => {
  res.json({
    data: bot.data.alerts,
    count: bot.data.alerts.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', (req, res) => {
  res.json(bot.getStats());
});

app.get('/api/export', (req, res) => {
  res.json(bot.exportData());
});

app.post('/api/settings', (req, res) => {
  try {
    const settingsPath = path.join(__dirname, 'settings.json');
    fs.writeFileSync(settingsPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/logs', (req, res) => {
  try {
    const logsPath = path.join(__dirname, 'logs', 'bot.log');
    if (fs.existsSync(logsPath)) {
      const logs = fs.readFileSync(logsPath, 'utf8').split('\n').slice(-100);
      res.json({ logs });
    } else {
      res.json({ logs: ['No logs yet'] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.DASHBOARD_PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📊 Dashboard running at http://localhost:${PORT}`);
});
