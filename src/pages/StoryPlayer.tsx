import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, PlayCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Choice, Scene, Story } from '../types';
import { audioManager } from '../lib/audio';
import { Volume2, VolumeX } from 'lucide-react';
import Lottie from 'lottie-react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LottieComponent = (Lottie as any).default || Lottie;

import loadingAnimation from '../assets/lottie/loading.json';
import accentAnimation from '../assets/lottie/accent.json';
import DynamicSceneBackground from '../components/DynamicSceneBackground';

// Dynamic imports for Lottie JSONs
import senatorLottie from '../assets/lottie/senator.json';
import sleepLottie from '../assets/lottie/sleep.json';
import daggerLottie from '../assets/lottie/dagger.json';
import crownLottie from '../assets/lottie/crown.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lottieAssets: Record<string, any> = {
  senator: senatorLottie,
  sleep: sleepLottie,
  dagger: daggerLottie,
  crown: crownLottie,
};

export default function StoryPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentSceneId, setCurrentSceneId] = useState<string | undefined>();
  const [mode, setMode] = useState<'story' | 'scroll' | 'read'>('story');
  const [showPaywall, setShowPaywall] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [scenePath, setScenePath] = useState<Scene[]>([]);

  useEffect(() => {
    import('../data/mockData').then((mockData) => {
        let foundStory = null;
        for (const cat of mockData.mockCategories) {
            const s = cat.stories.find(st => st.id === id);
            if (s) {
                foundStory = s;
                break;
            }
        }
        setStory(foundStory);
        setCurrentSceneId(foundStory?.scenes[0]?.id);
        setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    return () => {
      audioManager.stopAll();
    };
  }, []);

  const currentScene = story?.scenes.find(s => s.id === currentSceneId);

  useEffect(() => {
    if (currentScene && currentScene.audioUrl) {
      if (!isMuted) {
        audioManager.playSceneAudio(currentScene.audioUrl);
      }
    } else {
      audioManager.stopAll();
    }
  }, [currentScene, isMuted]);

  useEffect(() => {
    if (mode === 'scroll' && story && scenePath.length === 0 && currentScene) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScenePath([currentScene]);
    }
  }, [mode, story, currentScene, scenePath.length]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
        <LottieComponent animationData={loadingAnimation} loop={true} className="w-48 h-48 mb-4" />
        <p className="text-xl font-bold tracking-widest text-zinc-400">LOADING HISTORY...</p>
      </div>
    );
  }

  if (!story || !currentScene) return null;

  const handleChoice = (choice: Choice) => {
    if (choice.isPremium) {
      setShowPaywall(true);
      return;
    }
    setCurrentSceneId(choice.nextSceneId);

    if (mode === 'scroll') {
      const nextScene = story.scenes.find(s => s.id === choice.nextSceneId);
      if (nextScene) {
         setScenePath(prev => [...prev, nextScene]);
         setTimeout(() => {
           document.getElementById(`scroll-scene-${nextScene.id}`)?.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }
    }
  };

  const handleNext = () => {
    if (currentScene.choices && currentScene.choices.length > 0) return;

    const currentIndex = story.scenes.findIndex(s => s.id === currentSceneId);
    if (currentIndex < story.scenes.length - 1) {
      handleChoice({ id: 'next', text: 'Continue', nextSceneId: story.scenes[currentIndex + 1].id, isPremium: false });
    }
  };

  const handlePrev = () => {
    const currentIndex = story.scenes.findIndex(s => s.id === currentSceneId);
    if (currentIndex > 0) {
      setCurrentSceneId(story.scenes[currentIndex - 1].id);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioManager.unmute();
      setIsMuted(false);
      if (currentScene.audioUrl) {
         audioManager.playSceneAudio(currentScene.audioUrl);
      }
    } else {
      audioManager.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      {/* Top Navigation Overlay */}
      <div className="fixed top-0 w-full z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex gap-4">
          <div className="flex gap-2">
            {story.scenes.map((s, i) => {
              const isActive = s.id === currentSceneId;
              const isPast = story.scenes.findIndex(sc => sc.id === currentSceneId) > i;
              return (
                <div
                  key={s.id}
                  className={`h-1 w-8 rounded-full transition-all duration-500 ${
                    isActive ? 'bg-amber-500 scale-110' :
                    isPast ? 'bg-white/50' : 'bg-white/20'
                  }`}
                />
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="p-2 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-colors border border-white/10"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <div className="bg-black/50 backdrop-blur-sm rounded-full p-1 flex gap-1 border border-white/10">
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'story' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onClick={() => setMode('story')}
            >
              Story Mode
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'scroll' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onClick={() => setMode('scroll')}
            >
              Scroll Mode
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'read' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onClick={() => setMode('read')}
            >
              Read Mode
            </button>
          </div>
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-colors border border-white/10"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {mode === 'story' && (
        <div className="relative flex-1 flex flex-col justify-end overflow-hidden">
            {/* Click zones for navigation */}
            <div className="absolute inset-0 z-10 flex">
              <div className="w-1/3 h-full cursor-pointer pointer-events-auto" onClick={handlePrev} />
              <div className="w-2/3 h-full cursor-pointer pointer-events-auto" onClick={handleNext} />
            </div>

            <div className="absolute inset-0">
              <DynamicSceneBackground theme={currentScene.theme} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            </div>

            <AnimatePresence mode="wait">
              {currentScene.lottieAsset && lottieAssets[currentScene.lottieAsset] && (
                <motion.div
                  key={`lottie-${currentScene.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                >
                  <LottieComponent
                     animationData={lottieAssets[currentScene.lottieAsset]}
                     loop={true}
                     className="w-[500px] h-[500px] opacity-80 mix-blend-screen"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none mix-blend-screen z-0">
                <LottieComponent animationData={accentAnimation} loop={true} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-20 pb-24 px-4 md:px-12 max-w-4xl mx-auto w-full pointer-events-none"
              >
                <div className="mb-8 p-6 bg-black/40 backdrop-blur-md rounded-2xl border-l-4 border-amber-600 shadow-2xl">
                  <p className="text-2xl md:text-4xl font-serif leading-relaxed drop-shadow-lg">
                    {currentScene.text}
                  </p>
                </div>

                {currentScene.choices && currentScene.choices.length > 0 && (
                  <div className="grid gap-4 pointer-events-auto">
                    {currentScene.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        className="group relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 hover:border-amber-500 p-4 rounded-xl text-left transition-all hover:scale-[1.02] shadow-xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/0 to-amber-600/0 group-hover:from-amber-600/20 group-hover:to-transparent transition-all duration-500" />
                        <div className="relative flex justify-between items-center z-10">
                          <span className="text-lg md:text-xl font-medium group-hover:text-amber-400 transition-colors">
                            {choice.text}
                          </span>
                          {choice.isPremium ? (
                            <Lock className="text-amber-500" size={20} />
                          ) : (
                            <PlayCircle className="text-zinc-500 group-hover:text-amber-500 transition-colors" size={20} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
        </div>
      )}

      {mode === 'read' && (
        <div className="flex-1 overflow-y-auto bg-zinc-950 px-4 py-24">
          <div className="max-w-2xl mx-auto space-y-16">
            {story.scenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-full rounded-2xl shadow-xl mb-8 overflow-hidden relative aspect-video bg-zinc-800">
                  <DynamicSceneBackground theme={scene.theme} />
                  {scene.lottieAsset && lottieAssets[scene.lottieAsset] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <LottieComponent
                         animationData={lottieAssets[scene.lottieAsset]}
                         loop={true}
                         className="w-48 h-48 opacity-80 mix-blend-screen"
                      />
                    </div>
                  )}
                </div>

                {scene.altHistoryText && (
                  <div className="mb-6 inline-block bg-amber-900/30 text-amber-500 px-4 py-1 rounded-full text-sm font-bold tracking-wider">
                    ALTERNATE HISTORY PATH
                  </div>
                )}

                <p className="text-xl md:text-2xl font-serif leading-relaxed text-zinc-300">
                  <span className="text-4xl text-amber-500 font-bold float-left mr-2 leading-none mt-1">
                    {scene.text.charAt(0)}
                  </span>
                  {scene.text.slice(1)}
                </p>

                {scene.choices && scene.choices.length > 0 && index === story.scenes.length - 1 && (
                  <div className="mt-12 p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                    <h3 className="text-xl font-bold mb-6 text-center text-amber-500">How will you shape history?</h3>
                    <div className="grid gap-4">
                      {scene.choices.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => handleChoice(choice)}
                          className="flex justify-between items-center bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl transition-colors"
                        >
                          <span className="text-lg">{choice.text}</span>
                          {choice.isPremium ? <Lock size={20} className="text-amber-500" /> : <PlayCircle size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {mode === 'scroll' && (
        <div className="flex-1 overflow-y-auto snap-y snap-mandatory bg-black">
        {scenePath.map((scene, i) => (
          <div key={`${scene.id}-${i}`} id={`scroll-scene-${scene.id}`} className="h-[100dvh] w-full snap-start relative flex items-center justify-center overflow-hidden bg-zinc-900">
             <div className="absolute inset-0 overflow-hidden">
               <DynamicSceneBackground theme={scene.theme} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />

              {scene.lottieAsset && lottieAssets[scene.lottieAsset] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <LottieComponent
                     animationData={lottieAssets[scene.lottieAsset]}
                     loop={true}
                     className="w-[600px] h-[600px] opacity-70 mix-blend-screen"
                  />
                </div>
              )}
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-12 pointer-events-none">
                <motion.div
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, delay: 0.2 }}
                   viewport={{ once: false, amount: 0.8 }}
                >
                  <div className="mb-8 p-6 bg-black/40 backdrop-blur-md rounded-2xl border-l-4 border-amber-600 shadow-2xl">
                    <p className="text-2xl md:text-5xl font-serif leading-relaxed drop-shadow-2xl font-bold">
                      {scene.text}
                    </p>
                  </div>
                </motion.div>

                {scene.choices && scene.choices.length > 0 && (
                   <motion.div
                     className="grid gap-4 pointer-events-auto"
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ delay: 1 }}
                   >
                    {scene.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        className="group relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 hover:border-amber-500 p-4 rounded-xl text-left transition-all hover:scale-[1.02] shadow-xl"
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/0 to-amber-600/0 group-hover:from-amber-600/20 group-hover:to-transparent transition-all duration-500" />
                         <div className="relative flex justify-between items-center z-10">
                           <span className="text-lg md:text-xl font-medium group-hover:text-amber-400 transition-colors">
                             {choice.text}
                           </span>
                           {choice.isPremium ? (
                             <Lock className="text-amber-500" size={20} />
                           ) : (
                             <PlayCircle className="text-zinc-500 group-hover:text-amber-500 transition-colors" size={20} />
                           )}
                         </div>
                      </button>
                    ))}
                  </motion.div>
                )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Paywall Overlay */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full shadow-2xl relative"
          >
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Lock className="text-amber-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2 font-serif text-white">Unlock History</h3>
            <p className="text-zinc-400 text-center mb-8">
              Discover alternate timelines and premium historical content with a Historia subscription.
            </p>
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl transition-colors mb-4">
              Subscribe Now
            </button>
            <p className="text-xs text-center text-zinc-500">
              Cancel anytime. Terms and conditions apply.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
