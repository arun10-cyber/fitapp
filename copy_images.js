const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\50e293a8-fc62-41b1-8063-6e88d10554ec';
const destAssets = 'C:\\Project10\\fitapp\\src\\assets';
const destPublic = 'C:\\Project10\\fitapp\\public';

const files = {
    'workout_split_bg_1772210279502.png': 'workout_bg.png',
    'suggestions_bg_1772210297848.png': 'suggestions_bg.png',
    'burn_calories_bg_1772210367817.png': 'burn_bg.png',
    'progress_bg_1772210402360.png': 'progress_bg.png'
};

for (const [srcFile, destFile] of Object.entries(files)) {
    const srcPath = path.join(sourceDir, srcFile);
    const dstAssetPath = path.join(destAssets, destFile);
    const dstPublicPath = path.join(destPublic, destFile);

    try {
        fs.copyFileSync(srcPath, dstAssetPath);
        console.log(`Copied ${srcFile} to assets`);
    } catch (e) { console.error('Assets copy failed:', e.message); }

    try {
        fs.copyFileSync(srcPath, dstPublicPath);
        console.log(`Copied ${srcFile} to public`);
    } catch (e) { console.error('Public copy failed:', e.message); }
}
