const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`Downloading: ${url}`);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      let downloaded = 0;
      const totalSize = parseInt(response.headers['content-length'], 10);
      
      response.on('data', (chunk) => {
        downloaded += chunk.length;
        if (totalSize) {
          const percent = ((downloaded / totalSize) * 100).toFixed(1);
          process.stdout.write(`\rDownloading ${path.basename(filepath)}: ${percent}%`);
        }
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`\nCompleted: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function downloadVideos() {
  const videoUrls = [
    {
      url: 'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.mp4',
      path: '_site/assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.mp4'
    },
    {
      url: 'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.webm',
      path: '_site/assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.webm'
    }
  ];
  
  console.log('Starting video downloads...');
  
  for (const video of videoUrls) {
    const fullPath = path.join(__dirname, '..', video.path);
    if (!fs.existsSync(fullPath)) {
      try {
        await downloadFile(video.url, fullPath);
      } catch (err) {
        console.error(`Failed to download ${video.url}:`, err.message);
      }
    } else {
      console.log(`Already exists: ${path.basename(video.path)}`);
    }
  }
  
  console.log('\nVideo downloads complete!');
}

downloadVideos().catch(console.error);