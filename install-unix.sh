#!/bin/bash

# GMGN Termux Bot - Auto Setup for macOS/Linux
# Simplified installation script

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║  🚀 GMGN Termux Bot - Auto Setup        ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}[✗] Node.js not found${NC}"
    echo "Please install from nodejs.org"
    exit 1
fi

echo -e "${GREEN}[✓]${NC} Node.js found: $(node --version)"

echo -e "\n${BLUE}[*] Setting up repository...${NC}"

if [ -d "$HOME/gmgn-termux-bot" ]; then
    cd "$HOME/gmgn-termux-bot"
    echo -e "${GREEN}[✓]${NC} Updating repository..."
    git pull
else
    echo -e "${GREEN}[*]${NC} Cloning repository..."
    git clone https://github.com/steam899/gmgn-termux-bot.git "$HOME/gmgn-termux-bot"
    cd "$HOME/gmgn-termux-bot"
fi

echo -e "\n${BLUE}[*] Installing dependencies...${NC}"
npm install
echo -e "${GREEN}[✓]${NC} Dependencies installed"

if [ ! -f ".env" ]; then
    echo -e "\n${BLUE}Enter your GMGN API Key${NC}"
    echo "Get it from: https://gmgn.ai/ai"
    read -p "GMGN_API_KEY: " API_KEY
    
    cat > .env << EOF
GMGN_API_KEY=$API_KEY
BOT_ENABLED=true
UPDATE_INTERVAL=60000
DASHBOARD_PORT=3000
EOF
    
    chmod 600 .env
    echo -e "${GREEN}[✓]${NC} .env file created"
else
    echo -e "${GREEN}[✓]${NC} .env already exists"
fi

mkdir -p logs

echo -e "\n${GREEN}╔════════════════════════════════════════╗"
echo "║    ✅ Setup Complete!                   ║"
echo "╚════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}🚀 Start bot:${NC}"
echo "   cd ~/gmgn-termux-bot"
echo "   npm start"

echo -e "\n${BLUE}📊 Dashboard:${NC}"
echo "   http://localhost:3000"

echo -e "\n${BLUE}💡 Tips:${NC}"
echo "   • Edit settings.json to customize"
echo "   • Check SETTINGS_GUIDE.md for options"
echo "   • Run 'npm run dev' for debug mode"

echo -e "\nHappy Trading! 🚀\n"