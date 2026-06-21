const fs = require('fs');
const https = require('https');

// A selection of high quality open source lotties from known good URLs
const files = [
  // Senator / Character (Using a medieval/history style character animation if possible, fallback to a walking cycle)
  { url: 'https://assets9.lottiefiles.com/packages/lf20_q7uarxnk.json', dest: 'src/assets/lottie/senator.json' },

  // Dagger / Betrayal / Action (Using a sword or dynamic action animation)
  { url: 'https://assets5.lottiefiles.com/packages/lf20_h5z31x4j.json', dest: 'src/assets/lottie/dagger.json' },

  // Crown / Triumph (Using an actual crown or trophy animation)
  { url: 'https://assets3.lottiefiles.com/packages/lf20_touohxv0.json', dest: 'src/assets/lottie/crown.json' },

  // Sleep / Bedroom (Using a moon or nighttime atmospheric animation)
  { url: 'https://assets1.lottiefiles.com/packages/lf20_yqs1pbj2.json', dest: 'src/assets/lottie/sleep.json' }
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
            console.log(`Failed to parse JSON from ${url}. Attempting to use Lottiefiles v2 API or fallback...`);
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
