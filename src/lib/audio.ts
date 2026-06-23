import { Howl, Howler } from 'howler';

// Using free/placeholder audio URLs for the prototype
const sounds = {
  bgMusic: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=epic-hollywood-trailer-9489.mp3'], // Epic tense music
    loop: true,
    volume: 0.3,
  }),
  click: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/15/audio_27d983411b.mp3?filename=button-pressed-38129.mp3'], // Interface click
    volume: 0.8,
  }),
  dramaticHit: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=heavy-cinematic-impact-6058.mp3'], // Cliffhanger boom
    volume: 1.0,
  })
};

let currentSceneAudio: Howl | null = null;

export const audioManager = {
  playBg: () => {
    if (!sounds.bgMusic.playing()) sounds.bgMusic.play();
  },
  stopBg: () => sounds.bgMusic.stop(),
  playClick: () => sounds.click.play(),
  playDramaticHit: () => sounds.dramaticHit.play(),
  playSceneAudio: (url: string) => {
    if (currentSceneAudio) {
      currentSceneAudio.stop();
    }
    currentSceneAudio = new Howl({ src: [url], volume: 0.5 });
    currentSceneAudio.play();
  },
  stopAll: () => {
    Howler.stop();
  },
  mute: () => {
    Howler.mute(true);
  },
  unmute: () => {
    Howler.mute(false);
  }
};
