/**
 * Script to prepare the application for production deployment
 *
 * Usage: node deploy.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current file directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we're in the project root
const projectRoot = path.resolve(__dirname);
process.chdir(projectRoot);

console.log('🚀 Preparing application for deployment...');

// Check if required files exist
if (!fs.existsSync('vercel.json')) {
  console.error('❌ vercel.json is missing. Please create it first.');
  process.exit(1);
}

// Create the build directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Ensure the public directory exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// Ensure _redirects exists
if (!fs.existsSync('public/_redirects')) {
  fs.writeFileSync('public/_redirects', '/*    /index.html   200');
  console.log('✅ Created _redirects file');
}

try {
  // Clean previous build by removing the dist directory
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    // Recursive removal of directory
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('   Removed existing dist directory');
  }

  // Run the build
  console.log('🔨 Building for production...');
  execSync('npm run build', { stdio: 'inherit' });

  // Copy vercel.json to dist folder
  console.log('📝 Copying configuration files...');
  fs.copyFileSync('vercel.json', 'dist/vercel.json');

  console.log('✅ Build completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Deploy using Vercel CLI: vercel');
  console.log('   - OR -');
  console.log('2. Import your project in the Vercel dashboard');
  console.log('\nRemember to set up your environment variables in Vercel:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  console.log('- VITE_SUPABASE_PROJECT_ID');
  console.log('- VITE_API_BASE_URL\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}