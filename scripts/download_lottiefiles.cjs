const fs = require('fs');
const https = require('https');

// Actual vector lottie animations hosted by Lottiefiles and other open source repos, verified to work
const files = [
  // A walking character
  { url: 'https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/lotties/animation.json', dest: 'src/assets/lottie/senator.json' },
  // Real loader
  { url: 'https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/lotties/loading.json', dest: 'src/assets/lottie/sleep.json' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
            JSON.parse(data); // verify
            fs.writeFileSync(dest, data);
            console.log(`Downloaded ${dest} successfully!`);
            resolve();
        } catch(e) {
            console.log(`Failed to parse JSON from ${url}. Text was: ${data.substring(0, 50)}`);
            reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  for (let file of files) {
    try {
      await download(file.url, file.dest);
    } catch (e) {
      console.error(e.message);
    }
  }
}

main();
