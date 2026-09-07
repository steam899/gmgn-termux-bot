#!/bin/bash

# GMGN Termux Bot - One-Click Setup Script
# This script automates the entire setup process

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════╗"
    echo "║  🚀 GMGN Termux Bot - One-Click Setup  ║"
    echo "║         Auto Installation Script       ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

install_nodejs() {
    print_step "Checking Node.js..."
    if command -v node &> /dev/null; then
        VERSION=$(node --version)
        print_success "Node.js already installed: $VERSION"
    else
        print_warning "Node.js not found, installing..."
        apt update -y
        apt install -y nodejs
        print_success "Node.js installed"
    fi
}

install_git() {
    print_step "Checking git..."
    if command -v git &> /dev/null; then
        print_success "git already installed"
    else
        print_warning "git not found, installing..."
        apt install -y git
        print_success "git installed"
    fi
}

setup_repo() {
    print_step "Setting up repository..."
    REPO_PATH="$HOME/gmgn-termux-bot"
    
    if [ -d "$REPO_PATH" ]; then
        print_warning "Repository already exists at $REPO_PATH"
        read -p "Update it? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cd "$REPO_PATH"
            git pull origin main
            print_success "Repository updated"
        fi
    else
        git clone https://github.com/steam899/gmgn-termux-bot.git "$REPO_PATH"
        print_success "Repository cloned"
    fi
    cd "$REPO_PATH"
}

install_deps() {
    print_step "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

setup_config() {
    print_step "Setting up configuration..."
    
    if [ -f ".env" ]; then
        print_warning ".env file already exists"
        read -p "Reconfigure? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Skipping configuration"
            return
        fi
    fi
    
    echo -e "\n${BLUE}Enter Your GMGN API Key${NC}"
    echo "Get it from: https://gmgn.ai/ai"
    read -p "GMGN_API_KEY: " API_KEY
    
    if [ -z "$API_KEY" ]; then
        print_error "API key is required!"
        return 1
    fi
    
    read -p "GMGN_PRIVATE_KEY (optional, press Enter to skip): " PRIVATE_KEY
    
    cat > .env << EOF
GMGN_API_KEY=$API_KEY
EOF
    
    if [ ! -z "$PRIVATE_KEY" ]; then
        echo "GMGN_PRIVATE_KEY=$PRIVATE_KEY" >> .env
    fi
    
    cat >> .env << EOF

BOT_ENABLED=true
UPDATE_INTERVAL=60000
LOG_LEVEL=info
DASHBOARD_PORT=3000
DASHBOARD_ENABLED=true
EOF
    
    chmod 600 .env
    print_success ".env file created"
}

setup_logs() {
    print_step "Setting up logs directory..."
    mkdir -p logs
    print_success "Logs directory ready"
}

setup_shortcuts() {
    print_step "Creating shortcuts..."
    
    cat > "$HOME/start-gmgn.sh" << 'EOF'
#!/bin/bash
cd "$HOME/gmgn-termux-bot"
npm start
EOF
    chmod +x "$HOME/start-gmgn.sh"
    
    cat > "$HOME/start-gmgn-screen.sh" << 'EOF'
#!/bin/bash
cd "$HOME/gmgn-termux-bot"
screen -S gmgn -d -m npm start
echo "Bot started in background!"
screen -r gmgn
EOF
    chmod +x "$HOME/start-gmgn-screen.sh"
    
    print_success "Shortcuts created in $HOME"
}

show_next_steps() {
    echo -e "\n${GREEN}"
    echo "╔════════════════════════════════════════╗"
    echo "║    ✅ Setup Complete!                  ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "\n${BLUE}🚀 Start bot:${NC}"
    echo -e "   ${YELLOW}npm start${NC}"
    echo -e "   or"
    echo -e "   ${YELLOW}~/start-gmgn.sh${NC}"
    
    echo -e "\n${BLUE}📊 Dashboard:${NC}"
    echo -e "   ${YELLOW}http://localhost:3000${NC}"
    
    echo -e "\n${BLUE}⚙️ Configuration:${NC}"
    echo -e "   Edit: ${YELLOW}nano ~/gmgn-termux-bot/settings.json${NC}"
    
    echo -e "\n${BLUE}📚 Documentation:${NC}"
    echo -e "   • README.md"
    echo -e "   • SETTINGS_GUIDE.md - Detailed settings"
    
    echo -e "\nHappy Trading! 🚀\n"
}

main() {
    print_header
    
    echo -e "${BLUE}This script will:${NC}"
    echo "  1. Install Node.js & npm"
    echo "  2. Clone repository"
    echo "  3. Install dependencies"
    echo "  4. Setup .env configuration"
    echo ""
    read -p "Continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Setup cancelled"
        exit 0
    fi
    
    echo ""
    install_nodejs
    install_git
    setup_repo
    install_deps
    setup_logs
    setup_config
    setup_shortcuts
    show_next_steps
}

main