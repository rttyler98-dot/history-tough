const fs = require('fs');
const https = require('https');

const files = [
  // Realistic loader
  { url: 'https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/lotties/loading.json', dest: 'src/assets/lottie/loading.json' },
  // Let's use some lotties from official lottiefiles examples that are hosted on github
  { url: 'https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/lotties/animation.json', dest: 'src/assets/lottie/accent.json' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
            JSON.parse(data);
            fs.writeFileSync(dest, data);
            console.log(`Downloaded ${dest}`);
            resolve();
        } catch(e) {
            console.log(`Invalid JSON from ${url}`);
            resolve(); // ignore
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
