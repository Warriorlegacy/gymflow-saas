const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const files = ['icon.png', 'adaptive-icon.png', 'splash.png'];

async function convert() {
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`Converting ${file} to proper PNG...`);
      const tempPath = filePath + '.tmp';
      await sharp(filePath).png().toFile(tempPath);
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
    }
  }
  console.log('Conversion complete!');
}

convert().catch(err => {
  console.error('Error during conversion:', err);
  process.exit(1);
});
