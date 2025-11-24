const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = './dist';
const zipFile = './excellent-master-extension.zip';

console.log('📦 开始打包扩展...');

// 清理旧文件
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
  console.log('🗑️  清理旧的 zip 文件');
}

// 检查 dist 目录是否存在
if (!fs.existsSync(distDir)) {
  console.error('❌ dist 目录不存在，请先运行 npm run build');
  process.exit(1);
}

// 创建压缩包
const output = fs.createWriteStream(zipFile);
const archive = archiver('zip', { 
  zlib: { level: 9 } // 最高压缩级别
});

output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ 打包完成!`);
  console.log(`📊 文件大小: ${sizeInMB} MB (${archive.pointer()} bytes)`);
  console.log(`📦 输出文件: ${zipFile}`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('⚠️  警告:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  console.error('❌ 打包失败:', err);
  throw err;
});

archive.pipe(output);

// 添加 dist 目录中的所有文件
archive.directory(distDir, false);

archive.finalize();
