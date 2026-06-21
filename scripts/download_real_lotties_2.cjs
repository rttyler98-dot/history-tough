const fs = require('fs');
const https = require('https');

const files = [
  // These are known working raw github user content links for high quality lotties
  // Character/Walking
  { url: 'https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/lotties/animation.json', dest: 'src/assets/lottie/senator.json' },
  // Let's grab some others from open source projects that host lotties
  { url: 'https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/canvas_api/tutorial/basic_animations/lottie.json', dest: 'src/assets/lottie/dagger.json' },
  { url: 'https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/lotties/loading.json', dest: 'src/assets/lottie/sleep.json' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
            JSON.parse(data); // verify
            fs.writeFileSync(dest, data);
            console.log(`Downloaded ${dest} successfully!`);
            resolve();
        } catch(e) {
            console.log(`Failed to parse JSON from ${url}.`);
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
