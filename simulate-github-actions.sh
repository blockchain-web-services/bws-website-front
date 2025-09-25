#!/bin/bash

# Simulate GitHub Actions Build Environment Locally
# This script mimics the exact steps from the GitHub Actions workflow

set -e  # Exit on error
set -o pipefail  # Pipe failures cause script to fail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions for colored output
log_info() { echo -e "${CYAN}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "\n${BLUE}====>${NC} $1"; }

# Header
echo -e "${CYAN}"
echo "========================================="
echo "  GitHub Actions Build Simulator"
echo "  Simulating CI/CD Environment Locally"
echo "========================================="
echo -e "${NC}"

# Start from a clean state
log_step "Step 1: Cleaning environment"

# Remove any existing build artifacts
if [ -d "_site" ]; then
    log_info "Removing existing _site directory..."
    rm -rf _site
fi

if [ -d "_site_backup" ]; then
    log_info "Removing existing _site_backup directory..."
    rm -rf _site_backup
fi

# Clean node_modules to simulate fresh CI environment
log_step "Step 2: Simulating fresh CI environment"

log_info "Removing build/node_modules to simulate clean install..."
if [ -d "build/node_modules" ]; then
    rm -rf build/node_modules
fi

log_info "Removing tests/node_modules to simulate clean install..."
if [ -d "tests/node_modules" ]; then
    rm -rf tests/node_modules
fi

# Install build dependencies (like GitHub Actions does with npm ci)
log_step "Step 3: Installing build dependencies"
cd build
log_info "Running npm ci in build directory..."
npm ci
cd ..

# Run the build
log_step "Step 4: Building the site"
cd build
log_info "Running npm run build..."

# Capture build output and exit code
BUILD_OUTPUT=$(npm run build 2>&1) && BUILD_EXIT_CODE=$? || BUILD_EXIT_CODE=$?

echo "$BUILD_OUTPUT"

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    log_error "Build failed with exit code $BUILD_EXIT_CODE"
    log_error "This matches the GitHub Actions failure"
    exit $BUILD_EXIT_CODE
fi

cd ..
log_success "Build completed successfully"

# Verify build output
log_step "Step 5: Verifying build output"

if [ ! -d "_site" ]; then
    log_error "_site directory not created!"
    exit 1
fi

if [ ! -f "_site/index.html" ]; then
    log_error "index.html not found in _site!"
    exit 1
fi

if [ ! -d "_site/assets" ]; then
    log_error "assets directory not found in _site!"
    exit 1
fi

log_success "Build output verified"

# Install test dependencies
log_step "Step 6: Installing test dependencies"
cd tests
log_info "Running npm ci in tests directory..."
npm ci

# Install Playwright browsers
log_step "Step 7: Installing Playwright browsers"
log_info "Installing Playwright Chromium..."
npx playwright install --with-deps chromium

# Run tests
log_step "Step 8: Running Playwright tests"
log_info "Running test suite..."

# Set environment variables like GitHub Actions does
export PORT=4321
export PLAYWRIGHT_BASE_URL="http://localhost:4321"

# Run tests and capture output
TEST_OUTPUT=$(npx playwright test --config=playwright.config.cjs --project=chromium 2>&1) && TEST_EXIT_CODE=$? || TEST_EXIT_CODE=$?

echo "$TEST_OUTPUT"

cd ..

# Summary
echo -e "\n${CYAN}"
echo "========================================="
echo "  Simulation Complete"
echo "========================================="
echo -e "${NC}"

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    log_success "✅ Build: PASSED"
else
    log_error "❌ Build: FAILED (exit code: $BUILD_EXIT_CODE)"
fi

if [ $TEST_EXIT_CODE -eq 0 ]; then
    log_success "✅ Tests: PASSED"
else
    log_warning "⚠️  Tests: FAILED (exit code: $TEST_EXIT_CODE)"
fi

echo ""
log_info "This simulation helps identify issues that only appear in CI/CD"
log_info "The environment closely matches GitHub Actions Ubuntu runner"

# Exit with build exit code if build failed, otherwise test exit code
if [ $BUILD_EXIT_CODE -ne 0 ]; then
    exit $BUILD_EXIT_CODE
else
    exit $TEST_EXIT_CODE
fi