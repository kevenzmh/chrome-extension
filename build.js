const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = './dist';
const zipFile = './excellent-master-extension.zip';

// 清理旧文件
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

// 创建压缩包
const output = fs.createWriteStream(zipFile);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✅ 打包完成! 文件大小: ${archive.pointer()} bytes`);
  console.log(`📦 输出文件: ${zipFile}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();