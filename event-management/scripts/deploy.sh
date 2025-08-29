#!/bin/bash

# EventSphere Production Deployment Script
# This script builds and deploys the EventSphere application

set -e

echo "🚀 Starting EventSphere Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="eventsphere"
BUILD_DIR="dist"
DEPLOY_DIR="/var/www/eventsphere"
BACKUP_DIR="/var/www/backups"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}Error: This script should not be run as root${NC}"
   exit 1
fi

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if npm ci --production=false; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Build application
build_application() {
    print_status "Building application for production..."
    
    if npm run build; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Create backup
create_backup() {
    if [ -d "$DEPLOY_DIR" ]; then
        print_status "Creating backup of current deployment..."
        
        BACKUP_NAME="eventsphere-backup-$(date +%Y%m%d-%H%M%S)"
        BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
        
        mkdir -p "$BACKUP_DIR"
        
        if cp -r "$DEPLOY_DIR" "$BACKUP_PATH"; then
            print_success "Backup created: $BACKUP_PATH"
        else
            print_warning "Failed to create backup, continuing..."
        fi
    fi
}

# Deploy application
deploy_application() {
    print_status "Deploying application..."
    
    # Create deployment directory
    sudo mkdir -p "$DEPLOY_DIR"
    
    # Copy built files
    if sudo cp -r "$BUILD_DIR"/* "$DEPLOY_DIR/"; then
        print_success "Application deployed to $DEPLOY_DIR"
    else
        print_error "Deployment failed"
        exit 1
    fi
    
    # Set proper permissions
    sudo chown -R www-data:www-data "$DEPLOY_DIR"
    sudo chmod -R 755 "$DEPLOY_DIR"
    
    print_success "Permissions set correctly"
}

# Configure web server
configure_webserver() {
    print_status "Configuring web server..."
    
    # Create nginx configuration
    NGINX_CONF="/etc/nginx/sites-available/eventsphere"
    
    cat << EOF | sudo tee "$NGINX_CONF" > /dev/null
server {
    listen 80;
    server_name eventsphere.local;
    root $DEPLOY_DIR;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle SPA routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy (adjust backend URL as needed)
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    # Enable site
    sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    if sudo nginx -t; then
        sudo systemctl reload nginx
        print_success "Web server configured and reloaded"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    sleep 5  # Wait for nginx to reload
    
    if curl -f http://localhost > /dev/null 2>&1; then
        print_success "Application is responding correctly"
    else
        print_error "Application is not responding"
        exit 1
    fi
}

# Cleanup
cleanup() {
    print_status "Cleaning up build artifacts..."
    
    # Remove old backups (keep last 5)
    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
        print_success "Old backups cleaned up"
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    check_prerequisites
    install_dependencies
    build_application
    create_backup
    deploy_application
    configure_webserver
    health_check
    cleanup
    
    print_success "🎉 EventSphere deployment completed successfully!"
    print_status "Application is now available at: http://localhost"
    print_status "Backend API should be running on: http://localhost:5000"
}

# Run main function
main "$@"
