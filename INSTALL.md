# GMGN Termux Bot - Installation & Setup Guide

## Step-by-Step Installation for Termux

### Prerequisites

1. **Install Termux** - Download from F-Droid (recommended) or Google Play
2. **Update Termux:**
   ```bash
   apt update && apt upgrade -y
   ```

### Step 1: Install Node.js and npm

```bash
# Install Node.js (includes npm)
apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Clone the Repository

```bash
# Navigate to home directory
cd ~

# Clone the bot
git clone https://github.com/steam899/gmgn-termux-bot.git

# Enter directory
cd gmgn-termux-bot
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- axios (API calls)
- express (web server)
- dotenv (environment variables)
- chalk (colored logs)
- node-cron (scheduling)
- table (formatted output)

### Step 4: Get Your GMGN API Key

1. Go to https://gmgn.ai/ai
2. Click "Create API Key"
3. Copy the generated key
4. Save it somewhere safe

### Step 5: Run Setup Wizard

```bash
npm run setup
```

The setup wizard will:
1. Ask for your GMGN API Key
2. Optionally ask for Private Key (for trading)
3. Create `.env` file with your credentials
4. Create `logs` directory

**Example:**
```
🚀 GMGN Termux Bot Setup

Enter your GMGN API Key
(Get it from https://gmgn.ai/ai)

GMGN_API_KEY: gmgn_abc123xyz...
GMGN_PRIVATE_KEY (optional, press Enter to skip): 

✓ .env created
✓ Logs directory created
✓ Setup completed!
```

### Step 6: Start the Bot

```bash
npm start
```

**Expected Output:**
```
[13:05:57] [INFO] 🚀 GMGN Termux Bot v1.0.0
[13:05:57] [INFO] Starting bot...
[13:05:57] [SUCCESS] API Key configured
[13:05:58] [SUCCESS] Fetched 20 trending tokens (sol)
[13:05:58] [SUCCESS] Fetched 15 new tokens (sol)
[13:05:58] [SUCCESS] Update completed
[13:05:58] [SUCCESS] Bot running! Updates every 60000ms
[13:05:58] [INFO] Dashboard: http://localhost:3000
```

### Step 7: Access Dashboard

**On Same Device:**
- Open browser: `http://localhost:3000`

**From Another Device (Same WiFi):**
1. Find Termux IP:
   ```bash
   ifconfig
   # Look for inet address under wlan0 (e.g., 192.168.1.100)
   ```
2. Open: `http://192.168.1.100:3000`

## Configuration

### Quick Config Changes

**Change monitoring interval (how often to update):**
```json
// settings.json
"monitoring": {
  "interval": 30000  // 30 seconds (default: 60000 = 1 minute)
}
```

**Monitor more tokens:**
```json
"trendingTokens": {
  "limit": 50  // Changed from 20
}
```

**Adjust alert sensitivity:**
```json
"alerts": {
  "priceChange": 25  // Alert on ±25% changes (was 50%)
}
```

**Change dashboard port:**
```json
"dashboard": {
  "port": 8080  // Use 8080 instead of 3000
}
```

## Running in Background

### Option 1: screen (Recommended)

```bash
# Install screen
apt install screen

# Start bot in background
screen -S gmgn -d -m npm start

# View running screen sessions
screen -ls

# Reconnect to bot
screen -r gmgn

# Detach without stopping
# Press Ctrl+A then D

# Kill session when done
screen -S gmgn -X quit
```

### Option 2: nohup

```bash
# Start in background
nohup npm start > bot.log 2>&1 &

# View logs
tail -f bot.log

# Kill process
kill %1
```

### Option 3: Termux:Boot (Auto-start on device boot)

1. Install Termux:Boot from F-Droid
2. Create boot script:
   ```bash
   mkdir -p ~/.termux/boot
   cat > ~/.termux/boot/start-gmgn << 'EOF'
   #!/data/data/com.termux/files/usr/bin/sh
   cd ~/gmgn-termux-bot
   nohup npm start > bot.log 2>&1 &
   EOF
   chmod +x ~/.termux/boot/start-gmgn
   ```
3. Grant Termux:Boot permissions
4. Bot will auto-start on device boot

## Monitoring Bot Health

### View Real-time Logs
```bash
tail -f logs/bot.log
```

### Check Memory Usage
```bash
top
# Or specifically for node
ps aux | grep node
```

### Monitor Dashboard
Visit `http://localhost:3000` → Logs tab for real-time monitoring

## Troubleshooting

### Problem: "npm: command not found"
**Solution:**
```bash
apt install -y nodejs
```

### Problem: "Cannot find module"
**Solution:**
```bash
cd ~/gmgn-termux-bot
npm install
```

### Problem: "GMGN_API_KEY not found"
**Solution:**
```bash
npm run setup
# Re-enter your API key
```

### Problem: "Address already in use (port 3000)"
**Solution:**
```bash
# Kill existing process
lsof -i :3000
kill -9 <PID>

# Or change port in settings.json
```

### Problem: "Can't access dashboard from other device"
**Solution:**
1. Check firewall is off
2. Verify IP address:
   ```bash
   ifconfig | grep inet
   ```
3. Ensure both devices on same WiFi
4. Try accessing with IP instead of hostname

### Problem: "API returns 401/403"
**Solution:**
1. Verify API key is correct
2. Regenerate at https://gmgn.ai/ai
3. Check IP whitelist settings
4. Restart bot after updating

## Performance Tips

1. **Increase interval for lower resource usage:**
   ```json
   "monitoring": {
     "interval": 120000  // Check every 2 minutes
   }
   ```

2. **Reduce data fetching:**
   ```json
   "trendingTokens": {
     "limit": 10  // Monitor only top 10
   }
   ```

3. **Disable unnecessary features:**
   ```json
   "monitoring": {
     "trenches": {
       "enabled": false  // Disable new token tracking
     }
   }
   ```

## Updating the Bot

```bash
cd ~/gmgn-termux-bot

# Stop the bot (Ctrl+C)

# Pull latest changes
git pull origin main

# Reinstall dependencies if needed
npm install

# Start again
npm start
```

## Uninstalling

```bash
# Stop the bot (Ctrl+C)

# Remove bot directory
rm -rf ~/gmgn-termux-bot

# Optional: Remove Node.js if not needed
apt remove nodejs
```

## Next Steps

✅ Bot is running!

1. **Explore Dashboard** - Visit http://localhost:3000
2. **Review Settings** - Customize in `settings.json`
3. **Monitor Logs** - Check bot activity in Logs tab
4. **Export Data** - Download insights via Export button

---

**Need Help?**
- 📖 Check README.md for detailed info
- 🐛 Report issues on GitHub
- 💬 Ask questions in Discussions
