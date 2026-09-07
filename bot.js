import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

class GMGNBot {
  constructor() {
    this.apiKey = process.env.GMGN_API_KEY;
    this.settings = this.loadSettings();
    this.data = {
      trendingTokens: [],
      newTokens: [],
      alerts: [],
      lastUpdate: null,
      stats: {
        totalRequests: 0,
        errors: 0,
        uptime: 0
      }
    };
    this.startTime = Date.now();
    this.baseUrl = 'https://api.gmgn.ai/defi';
  }

  loadSettings() {
    try {
      const settingsPath = path.join(__dirname, 'settings.json');
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      console.log(chalk.green('✓ Settings loaded successfully'));
      return settings;
    } catch (error) {
      console.error(chalk.red('✗ Error loading settings.json:'), error.message);
      process.exit(1);
    }
  }

  log(level, message, data = '') {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warn: chalk.yellow,
      error: chalk.red,
      debug: chalk.gray
    };

    const color = colors[level] || chalk.white;
    const logMessage = `[${timestamp}] ${color(`[${level.toUpperCase()}]`)} ${message} ${data}`;
    console.log(logMessage);

    // Save to log file
    this.saveLog(logMessage);
  }

  saveLog(message) {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    fs.appendFileSync(path.join(logsDir, 'bot.log'), message + '\n');
  }

  async getTrendingTokens(chain = 'sol') {
    try {
      const config = this.settings.monitoring.trendingTokens;
      const params = new URLSearchParams({
        chain: config.chain,
        interval: config.interval,
        limit: config.limit,
        order_by: 'volume'
      });

      if (config.minLiquidity) {
        params.append('min_liquidity', config.minLiquidity);
      }

      config.filters.forEach(filter => {
        params.append('filter', filter);
      });

      const response = await axios.get(
        `${this.baseUrl}/v3/sort/trending?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      this.data.trendingTokens = response.data.data || [];
      this.data.stats.totalRequests++;
      this.log('success', `Fetched ${this.data.trendingTokens.length} trending tokens`, `(${chain})`);
      return this.data.trendingTokens;
    } catch (error) {
      this.data.stats.errors++;
      this.log('error', 'Failed to fetch trending tokens:', error.response?.data?.message || error.message);
      return [];
    }
  }

  async getNewTokens(chain = 'sol') {
    try {
      const config = this.settings.monitoring.trenches;
      const params = new URLSearchParams({
        chain: config.chain,
        type: 'new_creation',
        limit: config.limit
      });

      config.launchpads.forEach(lp => {
        params.append('launchpad_platform', lp);
      });

      const response = await axios.get(
        `${this.baseUrl}/v3/sort/trenches?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      this.data.newTokens = response.data.data || [];
      this.data.stats.totalRequests++;
      this.log('success', `Fetched ${this.data.newTokens.length} new tokens`, `(${chain})`);
      return this.data.newTokens;
    } catch (error) {
      this.data.stats.errors++;
      this.log('error', 'Failed to fetch new tokens:', error.response?.data?.message || error.message);
      return [];
    }
  }

  async getTokenInfo(chain = 'sol', address) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v3/token/info?chain=${chain}&address=${address}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      this.data.stats.totalRequests++;
      return response.data.data;
    } catch (error) {
      this.data.stats.errors++;
      this.log('error', 'Failed to fetch token info:', error.message);
      return null;
    }
  }

  checkAlerts() {
    const alerts = [];
    const config = this.settings.alerts;

    if (!config.enabled) return alerts;

    // Check price changes
    this.data.trendingTokens.slice(0, 10).forEach(token => {
      const priceChange = token.price_24h_change || 0;
      if (Math.abs(priceChange) > config.priceChange) {
        alerts.push({
          type: 'price_change',
          token: token.symbol || token.address,
          change: priceChange,
          timestamp: new Date()
        });
      }
    });

    this.data.alerts = alerts;
    return alerts;
  }

  getStats() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    return {
      ...this.data.stats,
      uptime: this.formatUptime(uptime),
      lastUpdate: this.data.lastUpdate,
      alertsCount: this.data.alerts.length,
      trendingCount: this.data.trendingTokens.length,
      newTokensCount: this.data.newTokens.length
    };
  }

  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  }

  async update() {
    this.log('info', 'Running scheduled update...');
    const config = this.settings.monitoring;

    if (config.trendingTokens.enabled) {
      await this.getTrendingTokens();
    }

    if (config.trenches.enabled) {
      await this.getNewTokens();
    }

    this.checkAlerts();
    this.data.lastUpdate = new Date().toISOString();
    this.log('success', 'Update completed');
  }

  start() {
    console.clear();
    this.log('info', chalk.cyan.bold('🚀 GMGN Termux Bot v1.0.0'));
    this.log('info', 'Starting bot...');

    if (!this.apiKey) {
      this.log('error', 'GMGN_API_KEY not found in .env file');
      this.log('info', 'Please run: npm run setup');
      process.exit(1);
    }

    this.log('success', 'API Key configured');

    // Initial update
    this.update();

    // Schedule updates
    const interval = this.settings.monitoring.interval / 1000;
    cron.schedule(`*/${Math.max(1, Math.floor(interval / 60))} * * * *`, () => {
      this.update();
    });

    this.log('success', `Bot running! Updates every ${this.settings.monitoring.interval}ms`);
    this.log('info', `Dashboard: http://localhost:${this.settings.dashboard.port}`);
  }

  exportData() {
    return {
      timestamp: new Date().toISOString(),
      trending: this.data.trendingTokens,
      newTokens: this.data.newTokens,
      alerts: this.data.alerts,
      stats: this.getStats()
    };
  }
}

// Main
const bot = new GMGNBot();
bot.start();

// Keep bot running
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n🛑 Shutting down bot...'));
  process.exit(0);
});

export default bot;
