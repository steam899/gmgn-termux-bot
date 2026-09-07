class Dashboard {
    constructor() {
        this.apiBase = '/api';
        this.refreshInterval = 5000;
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoRefresh();
        this.log('Dashboard initialized');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
                
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Buttons
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.loadInitialData();
        });

        document.getElementById('exportBtn')?.addEventListener('click', () => {
            this.exportData();
        });

        // Modal
        document.querySelector('.close')?.addEventListener('click', () => {
            this.closeModal();
        });
    }

    switchSection(section) {
        this.currentSection = section;
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`)?.classList.add('active');

        switch(section) {
            case 'trending':
                this.loadTrending();
                break;
            case 'new-tokens':
                this.loadNewTokens();
                break;
            case 'alerts':
                this.loadAlerts();
                break;
            case 'settings':
                this.loadSettings();
                break;
            case 'logs':
                this.loadLogs();
                break;
        }
    }

    async loadInitialData() {
        try {
            const [stats, trending, newTokens, alerts] = await Promise.all([
                this.fetch('/stats'),
                this.fetch('/trending'),
                this.fetch('/new-tokens'),
                this.fetch('/alerts')
            ]);

            this.updateDashboard(stats, trending, newTokens, alerts);
            this.updateLastUpdate();
        } catch (error) {
            this.showError('Failed to load data: ' + error.message);
        }
    }

    updateDashboard(stats, trending, newTokens, alerts) {
        // Update stats
        document.getElementById('trendingCount').textContent = stats.trendingCount || 0;
        document.getElementById('newTokensCount').textContent = stats.newTokensCount || 0;
        document.getElementById('alertsCount').textContent = stats.alertsCount || 0;
        document.getElementById('uptime').textContent = stats.uptime || '0d 0h';
        document.getElementById('totalRequests').textContent = stats.totalRequests || 0;
        document.getElementById('errorCount').textContent = stats.errors || 0;
    }

    updateLastUpdate() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent = `Last update: ${now.toLocaleTimeString()}`;
    }

    async loadTrending() {
        try {
            const data = await this.fetch('/trending');
            const tbody = document.getElementById('trendingBody');
            tbody.innerHTML = '';

            data.data.forEach((token, index) => {
                const change = token.price_24h_change || 0;
                const changeClass = change >= 0 ? 'positive' : 'negative';
                const changeSymbol = change >= 0 ? '▲' : '▼';

                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <strong>${token.symbol || 'N/A'}</strong>
                            <br>
                            <small>${token.address?.substring(0, 8)}...</small>
                        </td>
                        <td>$${parseFloat(token.price || 0).toFixed(6)}</td>
                        <td class="${changeClass}">${changeSymbol} ${Math.abs(change).toFixed(2)}%</td>
                        <td>$${this.formatNumber(token.volume_24h || 0)}</td>
                        <td>$${this.formatNumber(token.market_cap || 0)}</td>
                        <td><span class="token-badge">${token.chain || 'SOL'}</span></td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } catch (error) {
            this.showError('Failed to load trending: ' + error.message);
        }
    }

    async loadNewTokens() {
        try {
            const data = await this.fetch('/new-tokens');
            const grid = document.getElementById('newTokensGrid');
            grid.innerHTML = '';

            if (data.data.length === 0) {
                grid.innerHTML = '<div style="text-align: center; padding: 20px; grid-column: 1/-1; color: #999;">No new tokens found</div>';
                return;
            }

            data.data.forEach(token => {
                const card = `
                    <div class="token-card">
                        <div class="token-header">
                            <div>
                                <div class="token-name">${token.symbol || 'N/A'}</div>
                                <small>${token.address?.substring(0, 12)}...</small>
                            </div>
                            <span class="token-badge">NEW</span>
                        </div>
                        <div class="token-detail">
                            <span>Price:</span>
                            <span class="token-value">$${parseFloat(token.price || 0).toFixed(8)}</span>
                        </div>
                        <div class="token-detail">
                            <span>Liquidity:</span>
                            <span class="token-value">$${this.formatNumber(token.liquidity || 0)}</span>
                        </div>
                        <div class="token-detail">
                            <span>Dev Hold:</span>
                            <span class="token-value">${(token.dev_hold_rate || 0).toFixed(2)}%</span>
                        </div>
                        <div class="token-detail">
                            <span>Chain:</span>
                            <span class="token-value">${token.chain || 'SOL'}</span>
                        </div>
                    </div>
                `;
                grid.innerHTML += card;
            });
        } catch (error) {
            this.showError('Failed to load new tokens: ' + error.message);
        }
    }

    async loadAlerts() {
        try {
            const data = await this.fetch('/alerts');
            const list = document.getElementById('alertsList');
            list.innerHTML = '';

            if (data.data.length === 0) {
                list.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;"><i class="fas fa-inbox"></i> No alerts yet</div>';
                return;
            }

            data.data.forEach(alert => {
                const item = `
                    <div class="alert-item">
                        <div class="alert-content">
                            <div class="alert-title">${alert.token} - ${alert.type.replace('_', ' ').toUpperCase()}</div>
                            <div class="alert-time">${new Date(alert.timestamp).toLocaleTimeString()}</div>
                        </div>
                        <div class="alert-value">${alert.change > 0 ? '▲' : '▼'} ${Math.abs(alert.change).toFixed(2)}%</div>
                    </div>
                `;
                list.innerHTML += item;
            });
        } catch (error) {
            this.showError('Failed to load alerts: ' + error.message);
        }
    }

    async loadSettings() {
        try {
            const response = await fetch('settings.json');
            const settings = await response.json();
            const container = document.getElementById('settingsContainer');
            
            container.innerHTML = `
                <pre style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; overflow-x: auto;">${JSON.stringify(settings, null, 2)}</pre>
                <button class="btn btn-primary" style="margin-top: 20px;" onclick="location.href='settings.json'">
                    <i class="fas fa-download"></i> Download settings.json
                </button>
            `;
        } catch (error) {
            this.showError('Failed to load settings: ' + error.message);
        }
    }

    async loadLogs() {
        try {
            const data = await this.fetch('/logs');
            const list = document.getElementById('logsList');
            list.innerHTML = '';

            data.logs.forEach(log => {
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                
                if (log.includes('[ERROR]')) entry.classList.add('error');
                else if (log.includes('[SUCCESS]')) entry.classList.add('success');
                else if (log.includes('[WARN]')) entry.classList.add('warning');
                else entry.classList.add('info');
                
                entry.textContent = log;
                list.appendChild(entry);
            });
        } catch (error) {
            this.showError('Failed to load logs: ' + error.message);
        }
    }

    async fetch(endpoint) {
        const response = await fetch(`${this.apiBase}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
        return num.toFixed(2);
    }

    updateTime() {
        document.querySelectorAll('.alert-time, .log-time').forEach(el => {
            el.textContent = new Date().toLocaleTimeString();
        });
    }

    startAutoRefresh() {
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.loadInitialData();
            }
        }, this.refreshInterval);
    }

    exportData() {
        this.fetch('/export').then(data => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gmgn-export-${Date.now()}.json`;
            a.click();
        });
    }

    showError(message) {
        console.error(message);
        // Could show toast notification here
    }

    log(message) {
        console.log(`[Dashboard] ${message}`);
    }

    closeModal() {
        document.getElementById('modal').classList.remove('active');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
