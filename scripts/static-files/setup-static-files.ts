import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '..', '.env.local') });

const isDev = process.env.BUILD_MODE === 'development';
const adsenseId = process.env.GOOGLE_ADSENSE_CLIENT_ID;
const outDir = path.join(__dirname, '..', '..', 'out');

// robots.txt: 開発環境のみ配置
if (isDev) {
  const robotsContent = `User-agent: *
Disallow: /
`;
  const robotsDest = path.join(outDir, 'robots.txt');

  fs.writeFileSync(robotsDest, robotsContent);
  console.log('✅ robots.txt generated for development build');
}

// ads.txt: 環境変数があれば常に配置
if (adsenseId) {
  const adsContent = `google.com, pub-${adsenseId}, DIRECT, f08c47fec0942fa0
`;
  const adsDest = path.join(outDir, 'ads.txt');

  fs.writeFileSync(adsDest, adsContent);
  console.log('✅ ads.txt generated with AdSense ID');
} else {
  console.log('ℹ️  GOOGLE_ADSENSE_CLIENT_ID not found, skipping ads.txt generation');
}