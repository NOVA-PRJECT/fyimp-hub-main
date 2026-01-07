

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup script to copy PDF worker to public directory
 * This ensures the worker is available locally for Termux environment
 */

const sourcePath = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js');
const destPath = path.join(__dirname, '../public/pdf.worker.min.js');

try {
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
        console.error('❌ PDF worker not found at:', sourcePath);
        console.log('💡 Please run: npm install');
        process.exit(1);
    }

    // Create public directory if it doesn't exist
    const publicDir = path.dirname(destPath);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
        console.log('✅ Created public directory');
    }

    // Copy the worker file
    fs.copyFileSync(sourcePath, destPath);
    console.log('✅ PDF worker copied successfully to public/pdf.worker.min.js');
    
    // Verify the file was copied
    const stats = fs.statSync(destPath);
    console.log(`📄 File size: ${stats.size} bytes`);
    
} catch (error) {
    console.error('❌ Error copying PDF worker:', error.message);
    process.exit(1);
}
