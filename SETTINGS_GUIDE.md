# GMGN Termux Bot - Settings Configuration Guide

## 📋 Complete Settings.json Explanation

File location: `settings.json`

Semua setting dijelaskan detail dengan contoh praktis untuk berbagai use case.

---

## 🔧 Full Configuration Reference

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
    "theme": "dark",
    "showCharts": true
  },
  "logging": {
    "level": "info",
    "file": "logs/bot.log",
    "maxSize": "10m",
    "maxFiles": 5
  }
}
```

---

## 📚 Detailed Settings Explanation

### 1. **chains** - Blockchain Networks

```json
"chains": ["sol", "bsc", "base"]
```

**Penjelasan:**
- Pilih blockchain mana yang nak monitor
- Bot akan scan token di chain ini

**Pilihan yang tersedia:**
| Code | Blockchain | Keterangan |
|------|-----------|----------|
| `sol` | Solana | Paling populer untuk meme coin |
| `bsc` | Binance Smart Chain | Network yang cepat & murah |
| `base` | Base (Coinbase) | Layer 2 di Ethereum |
| `eth` | Ethereum | Mainnet Ethereum |
| `arc` | Arbitrum | Layer 2 populer |

**Contoh berbeda:**

```json
// Hanya Solana
"chains": ["sol"]

// Solana + BSC (most popular)
"chains": ["sol", "bsc"]

// Semua chain
"chains": ["sol", "bsc", "base", "eth"]
```

---

### 2. **monitoring** - Monitor Settings

#### 2.1 **monitoring.enabled** - Aktifkan Monitoring

```json
"monitoring": {
  "enabled": true
}
```

| Value | Arti |
|-------|------|
| `true` | Bot aktif monitor token |
| `false` | Bot berhenti, dashboard tetap jalan |

---

#### 2.2 **monitoring.interval** - Frekuensi Update

```json
"monitoring": {
  "interval": 60000
}
```

**Penjelasan:**
- Waktu dalam millisecond (ms)
- Seberapa sering bot fetch data baru
- 1000 ms = 1 detik

**Contoh interval:**

| Nilai | Waktu | Kegunaan |
|-------|-------|----------|
| `10000` | 10 detik | Ultra cepat (boros resource) |
| `30000` | 30 detik | Sangat cepat untuk scalping |
| `60000` | 1 menit | **Recommended (seimbang)** |
| `120000` | 2 menit | Moderate monitoring |
| `300000` | 5 menit | Light monitoring |
| `600000` | 10 menit | Very light (hemat battery) |

**Setting untuk berbagai kebutuhan:**

```json
// ⚡ Aggressive scalping (boros battery)
"interval": 10000

// 🎯 Normal trading
"interval": 60000

// 🔋 Battery saving mode
"interval": 300000
```

---

#### 2.3 **trendingTokens** - Monitor Token Trending

```json
"trendingTokens": {
  "enabled": true,
  "chain": "sol",
  "interval": "1h",
  "limit": 20,
  "minLiquidity": 10000,
  "filters": ["not_honeypot", "not_risk"]
}
```

**Sub-settings:**

**a) enabled** - Aktifkan trending tokens
```json
"enabled": true   // Monitor top trending tokens
"enabled": false  // Disable (hemat resource)
```

**b) chain** - Chain yang dipilih
```json
"chain": "sol"    // Solana
"chain": "bsc"    // Binance Smart Chain
"chain": "base"   // Base
```

**c) interval** - Time window untuk trending
```json
"interval": "1m"   // Top tokens dalam 1 menit
"interval": "5m"   // Top tokens dalam 5 menit
"interval": "15m"  // Top tokens dalam 15 menit
"interval": "1h"   // Top tokens dalam 1 jam ✅ RECOMMENDED
"interval": "6h"   // Top tokens dalam 6 jam
"interval": "24h"  // Top tokens dalam 24 jam
```

**d) limit** - Berapa token nak ditampilkan
```json
"limit": 10   // Hanya top 10 (hemat resource)
"limit": 20   // Top 20 (balanced) ✅ RECOMMENDED
"limit": 50   // Top 50 (detail)
"limit": 100  // Top 100 (comprehensive)
```

**e) minLiquidity** - Minimum liquidity untuk filter
```json
"minLiquidity": 5000      // Hanya token dengan liquidity > $5k
"minLiquidity": 10000     // > $10k ✅ RECOMMENDED
"minLiquidity": 50000     // > $50k (safer)
"minLiquidity": 100000    // > $100k (only established)
```

**Kenapa penting?**
- Liquidity kecil = mudah manipulasi
- Liquidity besar = lebih stabil tapi lebih sulit gerak

**f) filters** - Filter risiko
```json
"filters": ["not_honeypot", "not_risk"]
```

**Filter tersedia:**
| Filter | Arti |
|--------|------|
| `not_honeypot` | Exclude honeypot tokens |
| `not_risk` | Exclude high-risk tokens |
| `renounced` | Hanya token dengan renounced ownership |
| `verified` | Hanya verified tokens |

**Contoh kombinasi:**
```json
// Conservative (aman)
"filters": ["not_honeypot", "not_risk", "verified"]

// Balanced (recommended)
"filters": ["not_honeypot", "not_risk"]

// Aggressive (risky)
"filters": []
```

---

#### 2.4 **trenches** - Monitor New Token Launches

```json
"trenches": {
  "enabled": true,
  "chain": "sol",
  "launchpads": ["Pump.fun", "letsbonk"],
  "limit": 20
}
```

**Penjelasan:**
- Trenches = Newly launched tokens
- Monitor token baru sebelum trending

**Launchpad populer:**

| Launchpad | Chain | Tipe |
|-----------|-------|------|
| `Pump.fun` | SOL | Most popular |
| `letsbonk` | SOL | Community favorite |
| `fourmeme` | SOL | 4 minute launches |
| `clanker` | BASE | Base network |

**Contoh konfigurasi:**

```json
// Hanya Pump.fun
"launchpads": ["Pump.fun"]

// Pump.fun + letsbonk (recommended)
"launchpads": ["Pump.fun", "letsbonk"]

// Semua launchpad
"launchpads": ["Pump.fun", "letsbonk", "fourmeme", "clanker"]
```

**limit** - Berapa banyak token baru nak ditampilkan
```json
"limit": 10   // Hanya 10 paling baru
"limit": 20   // 20 paling baru (balanced)
"limit": 50   // 50 token baru (comprehensive)
```

---

### 3. **alerts** - Alert Settings

```json
"alerts": {
  "enabled": true,
  "priceChange": 50,
  "volumeIncrease": 5,
  "smartMoneyBuy": true
}
```

#### 3.1 **alerts.enabled** - Aktifkan Alerts
```json
"enabled": true   // Alerts aktif
"enabled": false  // Matikan alerts
```

#### 3.2 **alerts.priceChange** - Trigger Price Change Alert

```json
"priceChange": 50
```

**Penjelasan:**
- Alert trigger jika token naik/turun 50%
- Nilai dalam persen (%)

**Contoh nilai:**

| Nilai | Arti | Kegunaan |
|-------|------|----------|
| `10` | Alert di ±10% | Aggressive trading |
| `25` | Alert di ±25% | Moderate |
| `50` | Alert di ±50% | **Recommended** |
| `100` | Alert di ±100% | Conservative |

```json
// Untuk day traders (sering alert)
"priceChange": 25

// Untuk swing traders (recommended)
"priceChange": 50

// Untuk conservative traders
"priceChange": 100
```

#### 3.3 **alerts.volumeIncrease** - Volume Spike Alert

```json
"volumeIncrease": 5
```

**Penjelasan:**
- Alert jika volume naik 5x lipat dari normal
- Indikator aktivity tinggi

**Contoh:**
```json
// Alert jika volume naik 2x
"volumeIncrease": 2

// Alert jika volume naik 5x (recommended)
"volumeIncrease": 5

// Alert jika volume naik 10x
"volumeIncrease": 10
```

#### 3.4 **alerts.smartMoneyBuy** - Smart Money Alert

```json
"smartMoneyBuy": true
```

| Value | Arti |
|-------|------|
| `true` | Alert when smart money buys |
| `false` | Disable smart money alerts |

**Smart money** = professional traders/whales dengan track record bagus

---

### 4. **dashboard** - UI Settings

```json
"dashboard": {
  "enabled": true,
  "port": 3000,
  "refresh": 5000,
  "theme": "dark",
  "showCharts": true
}
```

#### 4.1 **dashboard.enabled** - Aktifkan Dashboard
```json
"enabled": true   // Dashboard berjalan
"enabled": false  // Hanya CLI bot, tidak ada UI
```

#### 4.2 **dashboard.port** - Port Dashboard

```json
"port": 3000
```

**Penjelasan:**
- Port untuk akses dashboard web
- Akses: `http://localhost:3000`

**Contoh port lain:**
```json
"port": 8080    // Jika port 3000 sudah dipakai
"port": 5000    // Alternative port
"port": 9000    // Another option
```

**Cara akses dari device lain:**
1. Cari IP Termux: `ifconfig` → cari `inet` address (e.g., `192.168.1.100`)
2. Akses: `http://192.168.1.100:3000`

#### 4.3 **dashboard.refresh** - Refresh Rate Dashboard

```json
"refresh": 5000
```

**Penjelasan:**
- Seberapa sering dashboard update (millisecond)
- 5000 ms = 5 detik

**Contoh:**
```json
"refresh": 1000   // Update setiap 1 detik (real-time)
"refresh": 5000   // Update setiap 5 detik (balanced) ✅
"refresh": 10000  // Update setiap 10 detik (hemat resource)
```

#### 4.4 **dashboard.theme** - UI Theme

```json
"theme": "dark"
```

| Theme | Deskripsi |
|-------|----------|
| `dark` | Dark mode (hemat mata) ✅ |
| `light` | Light mode (terang) |

#### 4.5 **dashboard.showCharts** - Show Price Charts

```json
"showCharts": true
```

| Value | Arti |
|-------|------|
| `true` | Tampilkan chart (lebih resource) |
| `false` | Hanya table (lebih ringan) |

---

### 5. **logging** - Log Settings

```json
"logging": {
  "level": "info",
  "file": "logs/bot.log",
  "maxSize": "10m",
  "maxFiles": 5
}
```

#### 5.1 **logging.level** - Log Verbosity

```json
"level": "info"
```

| Level | Deskripsi | Kegunaan |
|-------|-----------|----------|
| `debug` | Semua detail (sangat verbose) | Troubleshooting |
| `info` | Info penting (recommended) ✅ | Normal use |
| `warn` | Hanya warnings & errors | Minimal |
| `error` | Hanya errors | Hemat resource |

```json
// Development/debugging
"level": "debug"

// Production/normal use
"level": "info"

// Hemat resource
"level": "warn"
```

#### 5.2 **logging.file** - Log File Path

```json
"file": "logs/bot.log"
```

- File tempat menyimpan logs
- Otomatis dibuat jika tidak ada

#### 5.3 **logging.maxSize** - Max Log File Size

```json
"maxSize": "10m"
```

**Penjelasan:**
- Ukuran maksimal sebelum rotate
- Mencegah file log terlalu besar

```json
"maxSize": "5m"    // Rotate di 5MB
"maxSize": "10m"   // Rotate di 10MB ✅
"maxSize": "50m"   // Rotate di 50MB
```

#### 5.4 **logging.maxFiles** - Keep Max Log Files

```json
"maxFiles": 5
```

**Penjelasan:**
- Berapa file log lama yang disimpan
- File lama dihapus ketika exceeds

```json
"maxFiles": 3      // Keep 3 file logs
"maxFiles": 5      // Keep 5 file logs ✅
"maxFiles": 10     // Keep 10 file logs
```

---

## 🎯 Pre-built Configuration Presets

### Preset 1: **Conservative (Aman)**

```json
{
  "chains": ["sol"],
  "monitoring": {
    "enabled": true,
    "interval": 120000,
    "trendingTokens": {
      "enabled": true,
      "chain": "sol",
      "interval": "1h",
      "limit": 10,
      "minLiquidity": 50000,
      "filters": ["not_honeypot", "not_risk", "verified"]
    },
    "trenches": {
      "enabled": false
    }
  },
  "alerts": {
    "enabled": true,
    "priceChange": 100,
    "volumeIncrease": 10,
    "smartMoneyBuy": true
  },
  "dashboard": {
    "enabled": true,
    "port": 3000,
    "refresh": 10000,
    "theme": "dark",
    "showCharts": false
  },
  "logging": {
    "level": "warn",
    "file": "logs/bot.log",
    "maxSize": "10m",
    "maxFiles": 3
  }
}
```

**Keuntungan:**
- ✅ Low resource usage
- ✅ Battery efficient
- ✅ Safer tokens only
- ❌ Slower alerts

---

### Preset 2: **Balanced (Recommended)**

```json
{
  "chains": ["sol", "bsc"],
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
    "theme": "dark",
    "showCharts": true
  },
  "logging": {
    "level": "info",
    "file": "logs/bot.log",
    "maxSize": "10m",
    "maxFiles": 5
  }
}
```

**Keuntungan:**
- ✅ Good balance
- ✅ Fast updates
- ✅ Detect new tokens
- ✅ Reasonable resource

---

### Preset 3: **Aggressive (Fast)**

```json
{
  "chains": ["sol", "bsc", "base"],
  "monitoring": {
    "enabled": true,
    "interval": 30000,
    "trendingTokens": {
      "enabled": true,
      "chain": "sol",
      "interval": "5m",
      "limit": 50,
      "minLiquidity": 5000,
      "filters": ["not_honeypot"]
    },
    "trenches": {
      "enabled": true,
      "chain": "sol",
      "launchpads": ["Pump.fun", "letsbonk", "fourmeme"],
      "limit": 50
    }
  },
  "alerts": {
    "enabled": true,
    "priceChange": 25,
    "volumeIncrease": 3,
    "smartMoneyBuy": true
  },
  "dashboard": {
    "enabled": true,
    "port": 3000,
    "refresh": 2000,
    "theme": "dark",
    "showCharts": true
  },
  "logging": {
    "level": "debug",
    "file": "logs/bot.log",
    "maxSize": "50m",
    "maxFiles": 10
  }
}
```

**Keuntungan:**
- ✅ Very fast alerts
- ✅ Real-time data
- ✅ Multi-chain
- ❌ High resource usage
- ❌ Battery drain

---

## 🔄 How to Apply Settings

### Method 1: Direct Edit

```bash
# Edit settings.json
nano settings.json

# Make changes, then save (Ctrl+X, Y, Enter)

# Restart bot
npm start
```

### Method 2: Copy & Paste Preset

```bash
# Backup original
cp settings.json settings.json.bak

# Copy one of the presets above into settings.json
nano settings.json

# Paste, save, then restart
npm start
```

### Method 3: Web Dashboard (Future)

- Dashboard akan support edit settings via UI
- Coming in v1.1.0

---

## 📊 Quick Reference Table

| Setting | Range | Recommended | Impact |
|---------|-------|-------------|--------|
| `interval` | 10k-600k ms | 60k (1 min) | Resource/Speed |
| `trendingTokens.limit` | 5-100 | 20 | Data quantity |
| `minLiquidity` | 1k-1M | 10k | Safety |
| `priceChange` | 5-500% | 50 | Alert sensitivity |
| `dashboard.port` | 1024-65535 | 3000 | Access point |
| `dashboard.refresh` | 1k-30k ms | 5k | UI smoothness |
| `logging.maxFiles` | 1-20 | 5 | Disk storage |

---

## ❓ FAQ

**Q: Mana setting yang paling penting?**
A: `interval` - ini yang paling mempengaruhi speed vs resource usage

**Q: Gimana cara hemat battery?**
A: Naikkan `interval`, reduce `limit`, disable `showCharts`

**Q: Setting mana yang paling aman?**
A: Use "Conservative" preset dengan high `minLiquidity`

**Q: Bisa ganti setting tanpa restart?**
A: Belum (v1.0.0). Harus restart bot untuk apply changes

**Q: Alerts bekerja di background?**
A: Ya, alerts tetap bekerja walaupun tidak lihat dashboard

---

## 🚀 Tips Optimisasi

1. **Hemat Memory:**
   - Reduce `interval` to 120k+ ms
   - Set `limit` ke 10 atau kurang
   - Disable `showCharts`
   - Use `warn` or `error` logging level

2. **Cepat Detect Opportunity:**
   - Reduce `interval` ke 30k ms
   - Monitor multiple `chains`
   - Enable `trenches` untuk new tokens
   - Set low `priceChange` alert

3. **Aman & Conservative:**
   - High `minLiquidity` (50k+)
   - Strict `filters`
   - High `priceChange` alert (100+%)
   - Only 1 chain (SOL)

---

Semoga penjelasan ini membantu! 🎉
