# 🎓 GMGN Termux Bot - Tutorial & Examples

## Complete Tutorial for Beginners

This guide walks you through everything step-by-step with real examples.

---

## Part 1: Installation (10 minutes)

### Step 1: Open Termux

On your Android phone:
1. Open Termux app
2. You'll see a terminal prompt: `$`

### Step 2: Download & Run Setup

```bash
# Copy and paste this exact command:
curl -fsSL https://raw.githubusercontent.com/steam899/gmgn-termux-bot/main/install.sh | bash
```

**What happens:**
- Downloads the setup script
- Installs Node.js (if needed)
- Downloads bot files
- Asks for API key
- Creates configuration

### Step 3: Get API Key

While setup is running:
1. Open browser → https://gmgn.ai/ai
2. Click "Create API Key"
3. Copy the generated key
4. Paste into terminal when asked

### Step 4: Wait for Completion

Setup will show:
```
✓ Node.js installed
✓ Repository cloned
✓ Dependencies installed
✓ Configuration complete
```

---

## Part 2: Starting the Bot (2 minutes)

### First Time Startup

```bash
# Navigate to bot folder
cd ~/gmgn-termux-bot

# Start bot
npm start
```

**You should see:**
```
🚀 GMGN Termux Bot v1.0.0
[INFO] Starting bot...
[SUCCESS] API Key configured
[SUCCESS] Fetched 20 trending tokens (sol)
[SUCCESS] Fetched 15 new tokens (sol)
[SUCCESS] Bot running!
📊 Dashboard: http://localhost:3000
```

### Open Dashboard

1. On same phone: Open browser → `http://localhost:3000`
2. On another device:
   - Find Termux IP: `ifconfig` → look for `inet` (e.g., `192.168.1.100`)
   - Open: `http://192.168.1.100:3000`

---

## Part 3: Using the Dashboard (5 minutes)

### Dashboard Overview

You see 6 main tabs:

#### 📊 Dashboard Tab (Default)

**What you see:**
- Trending Tokens: 20 (number being monitored)
- New Tokens: 15 (recently launched)
- Active Alerts: 3 (price changes detected)
- Bot Status: 0d 2h 30m (uptime)

**Stats cards:**
- API Requests: How many API calls made
- Errors: Any connection issues

#### 🔥 Trending Tab

**Real-time table showing:**
| Column | Meaning | Example |
|--------|---------|----------|
| Rank | Position | #1, #2, #3 |
| Symbol | Token name | SOL, USDC |
| Price | Current price | $0.00012 |
| 24h Change | Price change | ▲ 45.23% |
| Volume | Trading volume | $1.5M |
| Market Cap | Total value | $500M |
| Chain | Blockchain | SOL, BSC |

**Green = Positive change ▲**
**Red = Negative change ▼**

#### ⭐ New Tokens Tab

**Shows recently launched tokens:**
- Token name & address
- Current price
- Liquidity
- Dev holdings percentage
- Launchpad source

**Example card:**
```
🆕 MOON
0x123abc...
Price: $0.00045
Liquidity: $25,000
Dev Hold: 15%
Launchpad: Pump.fun
```

#### 🔔 Alerts Tab

**Active alerts triggered:**
```
📈 DOGE - Price Change
↑ 85.50% | 13:45:22

📈 SHIB - Price Change
↓ 52.30% | 13:42:15
```

#### ⚙️ Settings Tab

**Current configuration:**
- Shows your settings.json file
- Button to download configuration
- (Edit feature coming in v1.1)

#### 📜 Logs Tab

**Real-time bot activity:**
```
[13:45:30] [SUCCESS] Fetched 20 trending tokens
[13:45:31] [INFO] Bot running
[13:45:45] [SUCCESS] Alert triggered: DOGE 85% up
[13:46:00] [INFO] Updating data...
```

**Color coding:**
- 🟢 Green = Success
- 🔵 Blue = Info
- 🟡 Yellow = Warning
- 🔴 Red = Error

---

## Part 4: Customizing Settings (10 minutes)

### Edit Configuration

```bash
# Open settings file
nano ~/gmgn-termux-bot/settings.json
```

### Example 1: Monitor More Tokens

**Original:**
```json
"limit": 20
```

**Change to:**
```json
"limit": 50
```

**Effect:** Monitor top 50 tokens instead of 20

### Example 2: Update Less Frequently (Save Battery)

**Original:**
```json
"interval": 60000
```

**Change to:**
```json
"interval": 300000
```

**Effect:** Update every 5 minutes instead of 1 minute

### Example 3: Stricter Safety Filter

**Original:**
```json
"minLiquidity": 10000
```

**Change to:**
```json
"minLiquidity": 100000
```

**Effect:** Only show tokens with $100k+ liquidity (safer)

### Example 4: Alert on Smaller Changes

**Original:**
```json
"priceChange": 50
```

**Change to:**
```json
"priceChange": 25
```

**Effect:** Get alerts on 25% changes instead of 50%

### Restart After Changes

```bash
# Stop bot: Ctrl+C

# Start again
npm start
```

---

## Part 5: Real-World Scenarios

### Scenario 1: Day Trader (Need Speed)

**Settings:**
```json
{
  "monitoring": {
    "interval": 30000,      // Fast updates
    "trendingTokens": {
      "limit": 50,          // Monitor many
      "minLiquidity": 5000   // Lower barrier
    }
  },
  "alerts": {
    "priceChange": 25       // Frequent alerts
  }
}
```

**Use:** Find quick moves, enter/exit fast

### Scenario 2: Conservative Investor (Safety First)

**Settings:**
```json
{
  "monitoring": {
    "interval": 120000,     // Slower updates
    "trendingTokens": {
      "limit": 10,          // Focus on top
      "minLiquidity": 100000 // High safety
    }
  },
  "alerts": {
    "priceChange": 100      // Only big moves
  }
}
```

**Use:** Find solid tokens, hold long-term

### Scenario 3: New Token Hunter (Early Entry)

**Settings:**
```json
{
  "monitoring": {
    "interval": 30000,
    "trenches": {
      "enabled": true,
      "limit": 50
    },
    "trendingTokens": {
      "enabled": true,
      "minLiquidity": 1000   // Catch very new
    }
  },
  "alerts": {
    "priceChange": 50,
    "smartMoneyBuy": true    // Watch smart money
  }
}
```

**Use:** Find tokens before they pump

---

## Part 6: Running in Background

### Keep Bot Running When Phone Locked

#### Method 1: Using screen (Easiest)

```bash
# First time: install screen
apt install screen

# Start bot in background
screen -S gmgn -d -m npm start

# Bot runs even if close Termux!
```

**To view bot output later:**
```bash
screen -r gmgn
```

**To detach (close window but keep running):**
```
Ctrl+A then D
```

#### Method 2: Using nohup (Alternative)

```bash
nohup npm start > bot.log 2>&1 &
```

#### Method 3: Auto-start on Boot (Advanced)

1. Install Termux:Boot from F-Droid
2. Create boot script:
   ```bash
   mkdir -p ~/.termux/boot
   echo '#!/bin/bash' > ~/.termux/boot/gmgn
   echo 'cd ~/gmgn-termux-bot && screen -S gmgn -d -m npm start' >> ~/.termux/boot/gmgn
   chmod +x ~/.termux/boot/gmgn
   ```
3. Restart phone
4. Bot starts automatically!

---

## Part 7: Monitoring & Maintenance

### Check Bot Status

```bash
# View live logs
tail -f logs/bot.log

# See last 50 lines
tail -50 logs/bot.log

# Find errors
grep ERROR logs/bot.log
```

### Check Memory Usage

```bash
# View Node.js process
ps aux | grep node

# See system resources
top
```

### Restart Bot

```bash
# Stop: Ctrl+C

# Or kill process
kill -9 $(pgrep -f 'npm start')

# Start again
npm start
```

---

## Part 8: Troubleshooting

### Problem: "npm: command not found"

**Solution:**
```bash
apt install nodejs
```

### Problem: "API Key invalid"

**Solution:**
1. Go to https://gmgn.ai/ai
2. Generate new key
3. Run `npm run setup`
4. Enter new key

### Problem: "Port 3000 already in use"

**Solution 1:** Change port
```bash
# Edit settings.json
nano settings.json

# Change:
"port": 8080  # instead of 3000

# Then access: http://localhost:8080
```

**Solution 2:** Kill existing process
```bash
lsof -i :3000
kill -9 <PID>
```

### Problem: "Can't access dashboard from other device"

**Solution:**
1. Check IP:
   ```bash
   ifconfig
   ```
   Look for line like: `inet 192.168.1.100`

2. Access: `http://192.168.1.100:3000`

3. Make sure both devices on same WiFi

### Problem: High Memory Usage

**Solution:**
```json
// In settings.json
"monitoring": {
  "interval": 120000,     // Increase to 2 min
  "trendingTokens": {
    "limit": 10           // Reduce from 20
  }
},
"dashboard": {
  "showCharts": false     // Disable charts
}
```

---

## 📚 Next Steps

1. **Read Full Docs:**
   - `README.md` - Overview
   - `SETTINGS_GUIDE.md` - Detailed settings
   - `QUICK_START.md` - Quick reference

2. **Customize:**
   - Tweak `settings.json` for your needs
   - Enable/disable features
   - Adjust alert sensitivity

3. **Monitor:**
   - Check dashboard daily
   - Review logs for issues
   - Adjust settings based on results

4. **Trade:**
   - Use insights for decisions
   - Test with small amounts
   - Scale up when comfortable

---

## 🎯 Success Tips

✅ Start with balanced settings
✅ Monitor dashboard regularly
✅ Keep bot running 24/7 with screen
✅ Review logs for insights
✅ Adjust settings gradually
✅ Test new settings with small amounts
✅ Join GMGN community for tips
✅ Keep software updated

---

**Congratulations! You now have a working GMGN bot! 🎉**

Happy trading! 🚀
