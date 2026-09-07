# 🚀 GMGN Termux Bot

A simple, lightweight GMGN bot for Termux with an attractive dashboard UI. Monitor trending tokens, track new launches, and get real-time alerts - all from your phone!

## ✨ Features

- 📊 **Beautiful Dashboard** - Real-time monitoring with gorgeous UI
- 📱 **Termux Compatible** - Works seamlessly on Android Termux
- ⚡ **Fast & Lightweight** - Minimal dependencies, runs smoothly
- 🔧 **Easy Setup** - Just add your API key, that's it!
- 📈 **Trending Tokens** - Monitor top tokens across Solana, BSC, Base
- 🆕 **New Token Discovery** - Track fresh launches on Pump.fun, letsbonk, etc.
- 🔔 **Smart Alerts** - Get notified of price changes and volume spikes
- 📝 **Real-time Logs** - Monitor bot activity in real-time
- 💾 **Data Export** - Export data as JSON for analysis

## 📋 Requirements

- Node.js 16+
- npm 7+
- GMGN API Key (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd ~
git clone https://github.com/steam899/gmgn-termux-bot.git
cd gmgn-termux-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup API Key

```bash
npm run setup
```

You'll be prompted to enter:
- **GMGN_API_KEY** - Get it from https://gmgn.ai/ai
- **GMGN_PRIVATE_KEY** (optional) - For trading features

### 4. Start the Bot

```bash
npm start
```

The dashboard will be available at: **http://localhost:3000**

## 📱 Accessing from Your Device

### From Another Device on Same Network

```bash
# Find your Termux device IP
ifconfig

# Then access from your computer/phone:
http://<your-termux-ip>:3000
```

### Using SSH Tunnel

```bash
# From your computer:
ssh -L 3000:localhost:3000 user@termux-ip

# Then open: http://localhost:3000
```

## ⚙️ Configuration

Edit `settings.json` to customize:

```json
{
  "chains": ["sol", "bsc", "base"],
  "monitoring": {
    "enabled": true,
    "interval": 60000,
    "trendingTokens": {
      "enabled": true,
      "chain": "sol",
      "interval": "1h",
      "limit": 20,
      "minLiquidity": 10000,
      "filters": ["not_honeypot", "not_risk"]
    },
    "trenches": {
      "enabled": true,
      "chain": "sol",
      "launchpads": ["Pump.fun", "letsbonk"],
      "limit": 20
    }
  },
  "alerts": {
    "enabled": true,
    "priceChange": 50,
    "volumeIncrease": 5,
    "smartMoneyBuy": true
  },
  "dashboard": {
    "enabled": true,
    "port": 3000,
    "refresh": 5000,
    "theme": "dark"
  }
}
```

### Configuration Options

| Setting | Description | Default |
|---------|-------------|----------|
| `chains` | Blockchains to monitor | `["sol", "bsc", "base"]` |
| `monitoring.interval` | Update frequency (ms) | `60000` (1 minute) |
| `monitoring.trendingTokens.limit` | Top tokens to track | `20` |
| `monitoring.trendingTokens.minLiquidity` | Minimum liquidity filter | `10000` |
| `alerts.priceChange` | Price change % to trigger alert | `50` |
| `dashboard.port` | Dashboard port | `3000` |
| `dashboard.refresh` | Dashboard refresh rate (ms) | `5000` |

## 📊 Dashboard Sections

### 1. Dashboard
- Quick stats overview
- API requests counter
- Bot uptime
- Error tracking

### 2. Trending
- Top 20 trending tokens
- Price, volume, market cap
- 24h price changes
- Chain information

### 3. New Tokens
- Recently launched tokens
- Dev holdings percentage
- Liquidity information
- Launchpad source

### 4. Alerts
- Active price change alerts
- Volume spikes
- Smart money activity
- Timestamp tracking

### 5. Settings
- View current configuration
- Download settings.json
- Edit monitoring preferences

### 6. Logs
- Real-time bot logs
- Color-coded by level
- Last 100 entries
- Download capability

## 🛠️ Commands

```bash
# Start bot with dashboard
npm start

# Start in development mode with verbose logging
npm run dev

# Run setup wizard again
npm run setup
```

## 📁 File Structure

```
gmgn-termux-bot/
├── bot.js                 # Main bot logic
├── dashboard.js           # Dashboard server
├── setup.js              # Setup wizard
├── settings.json         # Configuration
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .env                  # Your credentials (git ignored)
├── public/
│   ├── index.html        # Dashboard UI
│   ├── css/
│   │   └── style.css     # Dashboard styles
│   └── js/
│       └── app.js        # Dashboard logic
└── logs/
    └── bot.log           # Bot activity log
```

## 🔐 Security

⚠️ **Important Security Notes:**

1. **Never share your API key** - It's personal and has access to your funds
2. **Keep .env file safe** - Add to .gitignore (already done)
3. **Restrict file permissions:**
   ```bash
   chmod 600 .env ~/.config/gmgn/.env
   ```
4. **Use VPN on public WiFi** - Protects your credentials
5. **Test with small amounts first** - Before enabling trading features

## 📊 API Endpoints

The dashboard communicates with these endpoints:

```
GET  /api/trending      - Get trending tokens
GET  /api/new-tokens    - Get new token launches
GET  /api/alerts        - Get active alerts
GET  /api/stats         - Get bot statistics
GET  /api/logs          - Get bot logs
GET  /api/export        - Export all data as JSON
POST /api/settings      - Update settings
```

## 🐛 Troubleshooting

### "Cannot find module 'axios'"
```bash
npm install
```

### "GMGN_API_KEY not found"
```bash
npm run setup
# Enter your API key from https://gmgn.ai/ai
```

### Dashboard not accessible
```bash
# Check if port 3000 is in use
lsof -i :3000

# Change port in settings.json
# Or kill process using port
kill -9 <PID>
```

### "401/403 Unauthorized" errors
- Check your API key is correct
- Regenerate API key at https://gmgn.ai/ai
- Ensure IP whitelist is configured for your connection

### High memory usage
- Increase `monitoring.interval` in settings.json
- Reduce `trending.limit` and `newTokens.limit`
- Restart the bot: `npm start`

## 🌙 Keep Bot Running (Termux)

### Option 1: Using screen (Recommended)
```bash
# Install screen
apt install screen

# Start bot in screen
screen -S gmgn npm start

# Detach: Ctrl+A then D
# Reattach: screen -r gmgn
```

### Option 2: Using nohup
```bash
nohup npm start > bot.log 2>&1 &
```

### Option 3: Termux boot automation
Create a Termux:Boot script to auto-start on device boot.

## 📈 Usage Examples

### Monitor Top Gainers
1. Open Dashboard → Trending
2. Sort by "24h Change"
3. Review top performers

### Track New Launches
1. Go to Dashboard → New Tokens
2. Check launchpad source
3. Review dev holdings

### Set Price Alerts
1. Edit `settings.json`
2. Adjust `alerts.priceChange` percentage
3. Restart bot: `npm start`

### Export Data
1. Click "Export" button
2. JSON file downloads
3. Use for analysis/backtesting

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Submit a pull request

## 📝 License

MIT License - feel free to use commercially

## 💬 Support

- 📖 Check [GMGN Documentation](https://github.com/GMGNAI/gmgn-skills)
- 🐛 Report issues on GitHub
- 💡 Request features via GitHub Issues

## 🎯 Roadmap

- [ ] Telegram bot integration
- [ ] Discord webhook alerts
- [ ] Trading automation
- [ ] Advanced charting
- [ ] Mobile app
- [ ] Database persistence
- [ ] Multi-language support

## ⚠️ Disclaimer

This bot is for monitoring and educational purposes. Use at your own risk. Always:
- Test with small amounts first
- Never share your private keys
- Keep software updated
- Monitor your trades actively

The developers are not responsible for any losses or damages.

---

**Made with ❤️ for Termux traders**

GitHub: [steam899/gmgn-termux-bot](https://github.com/steam899/gmgn-termux-bot)
