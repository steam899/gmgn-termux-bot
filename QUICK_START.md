# 🚀 GMGN Termux Bot - Quick Reference

## ⚡ One-Click Installation

### For Termux (Android)
```bash
bash install.sh
```

### For macOS/Linux
```bash
bash install-unix.sh
```

### For Windows
```cmd
install.bat
```

---

## 📋 Manual Installation (5 Steps)

```bash
# 1. Clone
git clone https://github.com/steam899/gmgn-termux-bot.git
cd gmgn-termux-bot

# 2. Install
npm install

# 3. Setup (Interactive)
npm run setup

# 4. Configure (Optional)
nano settings.json

# 5. Start
npm start
```

---

## 🎯 First Time Setup

1. **Get API Key**: https://gmgn.ai/ai
2. **Run Setup**: `npm run setup`
3. **Enter Key**: Paste your GMGN API key
4. **Start Bot**: `npm start`
5. **Open Dashboard**: http://localhost:3000

---

## 📊 Dashboard Access

| Method | URL | Notes |
|--------|-----|-------|
| Local | `http://localhost:3000` | Same device |
| Network | `http://192.168.1.100:3000` | Other device (replace IP) |
| Remote | SSH tunnel | See docs |

---

## ⚙️ Configuration Quick Reference

### Most Important Settings

```json
{
  "chains": ["sol"],              // Blockchain to monitor
  "monitoring": {
    "interval": 60000,            // Update every 1 minute
    "trendingTokens": {
      "limit": 20,                // Show top 20 tokens
      "minLiquidity": 10000       // Minimum $10k liquidity
    }
  },
  "alerts": {
    "priceChange": 50             // Alert on 50% change
  },
  "dashboard": {
    "port": 3000                  // Access port
  }
}
```

### Quick Presets

**Conservative:**
```json
"interval": 120000, "limit": 10, "minLiquidity": 50000
```

**Balanced:**
```json
"interval": 60000, "limit": 20, "minLiquidity": 10000
```

**Aggressive:**
```json
"interval": 30000, "limit": 50, "minLiquidity": 5000
```

---

## 🛠️ Common Commands

| Command | Purpose |
|---------|----------|
| `npm start` | Start bot |
| `npm run dev` | Development mode |
| `npm run setup` | Setup wizard |
| `npm install` | Install dependencies |
| `tail -f logs/bot.log` | View live logs |

---

## 📁 Important Files

| File | Purpose |
|------|----------|
| `.env` | Your API credentials |
| `settings.json` | Bot configuration |
| `logs/bot.log` | Activity logs |
| `public/index.html` | Dashboard UI |
| `bot.js` | Core bot logic |

---

## 🔌 Keep Bot Running

### In Termux with screen
```bash
# Install screen
apt install screen

# Start in background
screen -S gmgn -d -m npm start

# View/reconnect
screen -r gmgn

# Detach
Ctrl+A then D
```

### Auto-start on boot (Termux:Boot)
```bash
mkdir -p ~/.termux/boot
echo '#!/bin/bash' > ~/.termux/boot/gmgn
echo 'cd ~/gmgn-termux-bot && npm start' >> ~/.termux/boot/gmgn
chmod +x ~/.termux/boot/gmgn
```

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "API Key not found"
```bash
npm run setup
```

### "Port 3000 already in use"
```bash
# Change port in settings.json
"port": 8080
```

### "Node.js not found"
```bash
apt install nodejs
```

---

## 📚 Documentation Files

| File | Read For |
|------|----------|
| `README.md` | Overview & features |
| `INSTALL.md` | Detailed installation |
| `SETTINGS_GUIDE.md` | All setting explanations |
| `QUICK_START.md` | This file |

---

## 🔐 Security Checklist

- ✅ Keep `.env` file safe
- ✅ Never share API key
- ✅ `chmod 600 .env` (secure permissions)
- ✅ Use VPN on public WiFi
- ✅ Test with small amounts
- ✅ Keep software updated

---

## 💡 Pro Tips

1. **Save bandwidth**: Increase `interval` to 120000ms
2. **Save battery**: Reduce `limit` and disable `showCharts`
3. **Faster alerts**: Reduce `interval` to 30000ms
4. **Safer tokens**: Increase `minLiquidity` to 50000+
5. **More details**: Check `SETTINGS_GUIDE.md`

---

## 🎯 Dashboard Tabs

| Tab | Shows |
|-----|-------|
| Dashboard | Stats overview |
| Trending | Top tokens by volume |
| New Tokens | Recently launched |
| Alerts | Price change alerts |
| Settings | Current config |
| Logs | Real-time bot activity |

---

## 📞 Support

- 📖 Read documentation
- 🔍 Check logs: `tail -f logs/bot.log`
- 🐛 Report issues on GitHub
- 💬 Ask in GitHub Discussions

---

## 🎉 You're All Set!

```bash
# 1. Start
npm start

# 2. Open
http://localhost:3000

# 3. Monitor
Watch for trends, new tokens, alerts

# 4. Customize
Edit settings.json as needed

# 5. Trade!
🚀
```

---

**Bookmark this file for quick reference!** ⭐
