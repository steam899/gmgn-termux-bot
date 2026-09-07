import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function setup() {
  console.clear();
  console.log(chalk.cyan.bold('\n🚀 GMGN Termux Bot Setup\n'));

  try {
    // Check if .env exists
    const envPath = path.join(__dirname, '.env');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      console.log(chalk.yellow('ℹ .env file already exists'));
      const overwrite = await question('Overwrite? (y/n): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log(chalk.green('✓ Skipped .env setup'));
      } else {
        envContent = await getEnvContent();
        fs.writeFileSync(envPath, envContent);
        console.log(chalk.green('✓ .env updated'));
      }
    } else {
      envContent = await getEnvContent();
      fs.writeFileSync(envPath, envContent);
      console.log(chalk.green('✓ .env created'));
    }

    // Create logs directory
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
      console.log(chalk.green('✓ Logs directory created'));
    }

    console.log(chalk.green.bold('\n✓ Setup completed!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.gray('1. npm start           - Start the bot'));
    console.log(chalk.gray('2. npm run dev        - Start in development mode'));
    console.log(chalk.gray('3. Edit settings.json - Customize your settings'));
    console.log(chalk.cyan('\nDashboard will be available at http://localhost:3000\n'));

    rl.close();
  } catch (error) {
    console.error(chalk.red('✗ Setup failed:'), error.message);
    rl.close();
    process.exit(1);
  }
}

async function getEnvContent() {
  console.log(chalk.blue('\nEnter your GMGN API Key'));
  console.log(chalk.gray('(Get it from https://gmgn.ai/ai)\n'));

  const apiKey = await question(chalk.cyan('GMGN_API_KEY: '));

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API Key is required');
  }

  const privateKey = await question(chalk.cyan('GMGN_PRIVATE_KEY (optional, press Enter to skip): '));

  let content = `# GMGN API Configuration
GMGN_API_KEY=${apiKey}
`;

  if (privateKey && privateKey.trim().length > 0) {
    content += `GMGN_PRIVATE_KEY=${privateKey}
`;
  }

  content += `
# Bot Configuration
BOT_ENABLED=true
UPDATE_INTERVAL=60000
LOG_LEVEL=info

# Dashboard
DASHBOARD_PORT=3000
DASHBOARD_ENABLED=true
`;

  return content;
}

setup();
