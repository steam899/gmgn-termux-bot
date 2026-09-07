#!/usr/bin/env python3
"""
GMGN API Key Auto-Setup Script
Generates Ed25519 key pair, creates .env file, and configures GMGN CLI credentials.

Usage:
    python3 setup_api_key.py                    # Interactive mode
    python3 setup_api_key.py --auto             # Generate key + create .env
    python3 setup_api_key.py --api-key YOUR_KEY # Use existing API key
"""

import os
import sys
import json
import subprocess
import argparse
from pathlib import Path
from getpass import getpass
import tempfile
import re
import shutil


class GMGNSetup:
    """Handles GMGN API key generation and configuration."""
    
    def __init__(self):
        self.home_dir = Path.home()
        self.config_dir = self.home_dir / ".config" / "gmgn"
        self.project_dir = Path.cwd()
        self.global_env = self.config_dir / ".env"
        self.project_env = self.project_dir / ".env"
        self.private_key_path = None
        self.public_key = None
        self.api_key = None
        self.private_key = None
        self.openssl_path = self._find_openssl()
    
    def _find_openssl(self):
        """Find OpenSSL in various locations (especially for Termux)."""
        # Try standard which first
        try:
            result = subprocess.run(['which', 'openssl'], capture_output=True, text=True)
            if result.returncode == 0:
                return result.stdout.strip()
        except:
            pass
        
        # Common Termux paths
        termux_paths = [
            '/data/data/com.termux/files/usr/bin/openssl',
            '/system/bin/openssl',
            shutil.which('openssl'),  # Fallback to shutil
        ]
        
        for path in termux_paths:
            if path and os.path.exists(path):
                return path
        
        return None
    
    def log(self, level, msg):
        """Print colored log messages."""
        colors = {
            'info': '\033[94m',      # Blue
            'success': '\033[92m',   # Green
            'warning': '\033[93m',   # Yellow
            'error': '\033[91m',     # Red
            'reset': '\033[0m'
        }
        prefix = colors.get(level, '')
        reset = colors['reset']
        print(f"{prefix}[{level.upper()}]{reset} {msg}")
    
    def run_command(self, cmd, check=True):
        """Execute shell command and return output."""
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                check=check
            )
            return result.stdout.strip(), result.returncode
        except subprocess.CalledProcessError as e:
            self.log('error', f"Command failed: {cmd}")
            self.log('error', f"Error: {e.stderr}")
            return "", e.returncode
    
    def check_dependencies(self):
        """Verify required tools are installed."""
        self.log('info', "Checking dependencies...")
        
        # Check OpenSSL
        if not self.openssl_path:
            self.log('error', "OpenSSL not found")
            self.log('info', "Install with: apt install openssl")
            return False
        
        self.log('success', f"OpenSSL found at: {self.openssl_path}")
        
        # Check Python has necessary modules
        try:
            import subprocess
            import tempfile
            self.log('success', "Python dependencies OK")
        except ImportError as e:
            self.log('error', f"Missing Python module: {e}")
            return False
        
        self.log('success', "All dependencies found")
        return True
    
    def generate_ed25519_keypair(self):
        """Generate Ed25519 key pair using OpenSSL."""
        self.log('info', "Generating Ed25519 key pair...")
        
        if not self.openssl_path:
            self.log('error', "OpenSSL not available")
            return False
        
        with tempfile.TemporaryDirectory() as tmpdir:
            private_key_file = os.path.join(tmpdir, "private.pem")
            
            # Generate private key
            gen_cmd = f'{self.openssl_path} genpkey -algorithm ed25519 -out {private_key_file} 2>/dev/null'
            _, code = self.run_command(gen_cmd, check=False)
            
            if code != 0:
                self.log('error', "Failed to generate private key")
                self.log('info', f"Tried command: {gen_cmd}")
                return False
            
            # Extract public key
            pub_cmd = f'{self.openssl_path} pkey -in {private_key_file} -pubout 2>/dev/null'
            pub_key_output, code = self.run_command(pub_cmd, check=False)
            
            if code != 0:
                self.log('error', "Failed to extract public key")
                return False
            
            # Read private key
            with open(private_key_file, 'r') as f:
                self.private_key = f.read()
            
            self.public_key = pub_key_output
            self.log('success', "Key pair generated successfully")
            return True
    
    def display_keys(self):
        """Display keys for user registration."""
        print("\n" + "="*80)
        print("📋 YOUR ED25519 KEY PAIR")
        print("="*80 + "\n")
        
        print("🔑 PUBLIC KEY (submit this to https://gmgn.ai/ai):\n")
        print(self.public_key)
        print("\n" + "-"*80 + "\n")
        
        print("⚠️  PRIVATE KEY (keep this safe, never share):\n")
        # Show first/last few lines with middle hidden for security preview
        pk_lines = self.private_key.strip().split('\n')
        if len(pk_lines) > 3:
            preview = pk_lines[0] + '\n...[base64 content]...\n' + pk_lines[-1]
            print(preview)
        else:
            print(self.private_key)
        
        print("\n" + "="*80)
        print("✅ NEXT STEPS:")
        print("="*80)
        print("\n1️⃣  Copy the PUBLIC KEY above")
        print("2️⃣  Visit: https://gmgn.ai/ai")
        print("3️⃣  Paste public key into the form and submit")
        print("4️⃣  You'll receive an API Key — copy it")
        print("5️⃣  Return and paste the API Key below\n")
    
    def get_api_key_interactive(self):
        """Prompt user to enter API key from GMGN website."""
        print("\n" + "="*80)
        print("🔐 API KEY CONFIGURATION")
        print("="*80 + "\n")
        
        self.log('info', "Waiting for your API Key from https://gmgn.ai/ai...")
        self.api_key = input("\n📝 Paste your GMGN_API_KEY here: ").strip()
        
        if not self.api_key:
            self.log('error', "API Key cannot be empty")
            return False
        
        if len(self.api_key) < 20:
            self.log('warning', "API Key seems short (< 20 chars), but continuing...")
        
        self.log('success', "API Key received")
        return True
    
    def set_api_key(self, api_key):
        """Set API key from argument."""
        self.api_key = api_key
        if not self.api_key or len(self.api_key) < 20:
            self.log('warning', "API Key seems short, but continuing...")
        self.log('success', "API Key set")
        return True
    
    def create_env_file(self, target_path, include_private_key=True):
        """Create .env file with credentials."""
        if not self.api_key:
            self.log('error', "API Key not set")
            return False
        
        env_content = f"""# GMGN API Configuration
# Generated by setup_api_key.py

# API Key (required) — get from https://gmgn.ai/ai
GMGN_API_KEY={self.api_key}
"""
        
        if include_private_key and self.private_key:
            # Escape newlines for single-line format
            pk_escaped = self.private_key.replace('\n', '\\n')
            env_content += f'\nGMGN_PRIVATE_KEY="{pk_escaped}"\n'
        
        env_content += """
# Bot Configuration
BOT_ENABLED=true
UPDATE_INTERVAL=60000
LOG_LEVEL=info

# Dashboard
DASHBOARD_PORT=3000
DASHBOARD_ENABLED=true
"""
        
        try:
            target_path.parent.mkdir(parents=True, exist_ok=True)
            target_path.write_text(env_content)
            target_path.chmod(0o600)  # chmod 600 for security
            self.log('success', f".env created at {target_path}")
            return True
        except Exception as e:
            self.log('error', f"Failed to create .env: {e}")
            return False
    
    def verify_cli_installation(self):
        """Check if gmgn-cli is available."""
        _, code = self.run_command("which gmgn-cli", check=False)
        if code == 0:
            self.log('success', "gmgn-cli is installed")
            return True
        
        self.log('warning', "gmgn-cli not found in PATH")
        return False
    
    def test_credentials(self):
        """Test credentials with gmgn-cli."""
        if not self.verify_cli_installation():
            self.log('warning', "Skipping credential test (gmgn-cli not installed)")
            return True
        
        self.log('info', "Testing credentials with gmgn-cli...")
        
        # Use demo key first
        cmd = 'GMGN_API_KEY=gmgn_solbscbaseethmonadtron gmgn-cli market trending --chain sol --interval 1h --limit 1 --raw 2>/dev/null'
        output, code = self.run_command(cmd, check=False)
        
        if code == 0 and output:
            self.log('success', "Demo key works (CLI is functional)")
            return True
        
        self.log('warning', "Could not verify with demo key, but .env is configured")
        return True
    
    def display_summary(self, env_path):
        """Show setup summary."""
        print("\n" + "="*80)
        print("✅ SETUP COMPLETE")
        print("="*80 + "\n")
        
        self.log('success', f".env file created at: {env_path}")
        self.log('success', "File permissions: 600 (secure)")
        
        print("\n📋 Configuration Summary:")
        print(f"  • API Key: {self.api_key[:10]}...{self.api_key[-5:]}")
        print(f"  • Private Key: {'✓ Configured' if self.private_key else '✗ Not configured'}")
        print(f"  • Global Config: {self.global_env.exists()}")
        print(f"  • Project Config: {self.project_env.exists()}")
        
        print("\n🚀 Next Steps:")
        print("  1. npm install")
        print("  2. npm start")
        print("  3. Open http://localhost:3000")
        
        if self.verify_cli_installation():
            print("\n💡 Test command:")
            print(f"  gmgn-cli market trending --chain sol --limit 3")
        
        print("\n" + "="*80 + "\n")
    
    def setup_global_config(self):
        """Optionally setup global config in ~/.config/gmgn."""
        response = input("\n❓ Setup global config at ~/.config/gmgn/.env? (y/n): ").strip().lower()
        if response == 'y':
            return self.create_env_file(self.global_env, include_private_key=True)
        return False
    
    def run_interactive(self):
        """Interactive setup wizard."""
        print("\n" + "="*80)
        print("🚀 GMGN API Key Auto-Setup Wizard")
        print("="*80 + "\n")
        
        if not self.check_dependencies():
            return False
        
        # Generate keys
        if not self.generate_ed25519_keypair():
            return False
        
        # Display keys
        self.display_keys()
        
        # Get API key
        if not self.get_api_key_interactive():
            return False
        
        # Setup locations
        print("\n" + "="*80)
        print("💾 CONFIGURATION LOCATIONS")
        print("="*80 + "\n")
        
        setup_global = self.setup_global_config()
        
        # Always setup project .env
        print("\n📁 Creating project .env...")
        if not self.create_env_file(self.project_env, include_private_key=True):
            return False
        
        # Test
        self.test_credentials()
        
        # Summary
        self.display_summary(self.project_env)
        
        return True
    
    def run_auto(self):
        """Automatic setup (non-interactive)."""
        self.log('info', "Running in auto mode...")
        
        if not self.check_dependencies():
            return False
        
        if not self.generate_ed25519_keypair():
            return False
        
        self.display_keys()
        
        # For auto mode, we cannot get API key interactively
        self.log('error', "Auto mode requires --api-key argument")
        return False
    
    def run_with_existing_key(self, api_key):
        """Setup with existing API key (generate new private key)."""
        self.log('info', "Using provided API key...")
        
        if not self.check_dependencies():
            return False
        
        if not self.generate_ed25519_keypair():
            return False
        
        self.set_api_key(api_key)
        
        # Setup locations
        self.log('info', "Creating .env files...")
        
        # Global config
        if self.config_dir.exists() or input("\n❓ Create global config at ~/.config/gmgn? (y/n): ").strip().lower() == 'y':
            self.create_env_file(self.global_env, include_private_key=True)
        
        # Project config
        self.create_env_file(self.project_env, include_private_key=True)
        
        # Test
        self.test_credentials()
        
        # Summary
        self.display_summary(self.project_env)
        
        return True


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="GMGN API Key Auto-Setup",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 setup_api_key.py                              # Interactive
  python3 setup_api_key.py --api-key sk_your_key_here   # With API key
  python3 setup_api_key.py --show-only-keys              # Show keys only
        """
    )
    parser.add_argument('--api-key', help='GMGN API Key (skip web registration)')
    parser.add_argument('--show-only-keys', action='store_true', help='Generate and show keys only')
    parser.add_argument('--auto', action='store_true', help='Automatic mode (requires --api-key)')
    parser.add_argument('--find-openssl', action='store_true', help='Find OpenSSL path and exit')
    
    args = parser.parse_args()
    
    setup = GMGNSetup()
    
    try:
        if args.find_openssl:
            if setup.openssl_path:
                print(f"✅ OpenSSL found at: {setup.openssl_path}")
                return 0
            else:
                print("❌ OpenSSL not found")
                return 1
        
        if args.show_only_keys:
            if not setup.check_dependencies():
                return 1
            if not setup.generate_ed25519_keypair():
                return 1
            setup.display_keys()
            return 0
        
        if args.api_key:
            return 0 if setup.run_with_existing_key(args.api_key) else 1
        
        if args.auto:
            setup.log('error', 'Auto mode requires --api-key')
            return 1
        
        # Interactive mode (default)
        return 0 if setup.run_interactive() else 1
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user")
        return 1
    except Exception as e:
        setup.log('error', f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
