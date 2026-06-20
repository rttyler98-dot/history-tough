import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, PlayCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Choice, Scene, Story } from '../types';
import { audioManager } from '../lib/audio';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';

const SimpleHistoryBackground = ({ bgClass }: { bgClass?: string }) => {
  // Extract primary color theme to determine scene elements
  const isNight = bgClass?.includes('indigo') || bgClass?.includes('slate');
  const isSunset = bgClass?.includes('amber') || bgClass?.includes('orange');
  const isBlood = bgClass?.includes('red');
  const isIndoor = bgClass?.includes('stone') || bgClass?.includes('neutral');

  return (
    <div className={`absolute inset-0 overflow-hidden ${bgClass || 'bg-blue-300'}`}>
      {/* Sky elements */}
      {!isIndoor && (
        <>
          <motion.div
            className={`absolute rounded-full ${isNight ? 'bg-zinc-100 w-24 h-24 right-1/4' : 'bg-yellow-300 w-32 h-32 right-1/3'}`}
            initial={{ top: '60%', opacity: 0 }}
            animate={{ top: isNight ? '15%' : isSunset ? '40%' : '10%', opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          {/* Clouds */}
          <motion.div
            className="absolute top-20 flex gap-4 opacity-50"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(5)].map((_, i) => {
              // Deterministic width based on index instead of Math.random
              const width = 100 + ((i * 37) % 100);
              return (
                <div key={i} className={`bg-white rounded-full ${isNight ? 'opacity-20' : 'opacity-80'}`} style={{ width, height: 40, marginLeft: 200 * i, marginTop: (i%3)*20 }} />
              );
            })}
          </motion.div>
        </>
      )}

      {/* Landscape/Hills or Indoor Pillars */}
      {isIndoor ? (
        <div className="absolute bottom-0 w-full h-full flex justify-around items-end opacity-40">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-16 h-3/4 bg-zinc-800 border-x-4 border-zinc-900 rounded-t-sm" />
           ))}
        </div>
      ) : (
        <>
          <motion.div
            className={`absolute -bottom-10 -left-10 w-[120%] h-1/3 rounded-t-[50%] ${isBlood ? 'bg-red-950' : isNight ? 'bg-indigo-950' : 'bg-emerald-700'}`}
          />
          <motion.div
            className={`absolute -bottom-20 -right-10 w-[120%] h-1/2 rounded-t-[50%] ${isBlood ? 'bg-red-900' : isNight ? 'bg-indigo-900' : 'bg-emerald-600'} opacity-80`}
          />
        </>
      )}
    </div>
  );
};

function LottiePlayer({ url }: { url: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load lottie", err));
  }, [url]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop={true}
      className="w-64 h-64 md:w-96 md:h-96"
    />
  );
}

export default function StoryPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentSceneId, setCurrentSceneId] = useState<string | undefined>();
  const [direction, setDirection] = useState<number>(0);
  const [mode, setMode] = useState<'story' | 'scroll' | 'read'>('story');
  const [showPaywall, setShowPaywall] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [scenePath, setScenePath] = useState<Scene[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/stories/${id}`)
      .then(res => res.json())
      .then(data => {
        setStory(data);
        setCurrentSceneId(data.scenes[0]?.id);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!story) return;

    const buildPath = () => {
       const path: Scene[] = [];
       let current: Scene | undefined = story.scenes[0];
       // Build linear path up to the first choice or end
       while (current) {
         path.push(current);
         if (current.choices && current.choices.length > 0) {
           break; // Stop at choice
         }
         if (current.isEnding) break;

         // Assuming linear progress if no choices
         const nextIndex = story.scenes.findIndex(s => s.id === current?.id) + 1;
         if (nextIndex < story.scenes.length && !story.scenes[nextIndex].altHistoryText && !story.scenes[nextIndex-1]?.choices) {
            current = story.scenes[nextIndex];
         } else {
             // In complex branching, this needs a proper tree traversal.
             // For this MVP, if we hit scenes that are targets of choices, we don't auto-append them.
             break;
         }
       }
       return path;
    };

    // Only rebuild path if it's completely empty (initial load)
    if (scenePath.length === 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setScenePath(buildPath());
    }
  }, [story, scenePath.length]);

  useEffect(() => {
    if (!isMuted) {
      audioManager.playBg();
    } else {
      audioManager.stopBg();
    }

    return () => {
      audioManager.stopBg(); // Cleanup on unmount
    };
  }, [isMuted]);

  useEffect(() => {
    if (story) {
      const scene = story.scenes.find((s) => s.id === currentSceneId);
      if (scene?.isCliffhanger) {
        // Show paywall after a short dramatic pause
        const timer = setTimeout(() => {
           setShowPaywall(true);
           if (!isMuted) audioManager.playDramaticHit();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentSceneId, story, isMuted]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!story) {
    return <div className="p-8 text-center text-white">Story not found.</div>;
  }

  const currentScene = story.scenes.find((s) => s.id === currentSceneId) || story.scenes[0];

  const handleReadScrollChoice = (choice: Choice) => {
    if (!isMuted) audioManager.playClick();
    const nextScene = story.scenes.find(s => s.id === choice.nextSceneId);
    if (nextScene) {
      // Append the chosen scene and subsequent linear scenes to the path
      let current: Scene | undefined = nextScene;
      const newPathAdditions: Scene[] = [];

      while (current) {
        newPathAdditions.push(current);
        if (current.choices && current.choices.length > 0) break;
        if (current.isEnding) break;

        const nextIndex = story.scenes.findIndex(s => s.id === current?.id) + 1;
        // Basic check to not auto-append if the next scene is an alternate branch target we shouldn't hit linearly
        if (nextIndex < story.scenes.length) {
            current = story.scenes[nextIndex];
        } else {
            break;
        }
      }
      setScenePath(prev => [...prev, ...newPathAdditions]);
      setCurrentSceneId(choice.nextSceneId); // Update current scene ID for paywall logic

      // Auto scroll logic could go here, but React needs to render first
      setTimeout(() => {
         const element = document.getElementById(`scene-${choice.nextSceneId}`);
         element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleNext = () => {
    if (showPaywall) return;

    // If scene has choices, wait for user input
    if (currentScene.choices && currentScene.choices.length > 0) return;

    if (currentScene.isEnding) {
      navigate('/');
      return;
    }

    const nextIndex = story.scenes.findIndex(s => s.id === currentSceneId) + 1;
    if (nextIndex < story.scenes.length) {
      setDirection(1);
      setCurrentSceneId(story.scenes[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (showPaywall) return;

    const prevIndex = story.scenes.findIndex(s => s.id === currentSceneId) - 1;
    if (prevIndex >= 0) {
      setDirection(-1);
      setCurrentSceneId(story.scenes[prevIndex].id);
    }
  };

  const handleChoice = (choice: Choice) => {
    if (!isMuted) audioManager.playClick();
    setDirection(1);
    setCurrentSceneId(choice.nextSceneId);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  if (mode === 'story') {
    return (
      <div className="fixed inset-0 bg-black text-white h-[100dvh] w-full overflow-hidden select-none">
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 w-full z-50 p-2 flex gap-1">
          {story.scenes.map((scene, i) => (
            <div key={scene.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  i < story.scenes.findIndex(s => s.id === currentSceneId)
                    ? 'w-full'
                    : i === story.scenes.findIndex(s => s.id === currentSceneId)
                      ? 'w-1/2' // Simulate progress
                      : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Top Controls */}
        <div className="absolute top-8 right-4 z-50 flex gap-4 items-center">
          <button onClick={toggleMute} className="p-2 bg-black/50 rounded-full hover:bg-black/70 text-white">
             {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button onClick={() => setMode('scroll')} className="px-4 py-2 bg-black/50 rounded-full hover:bg-black/70 text-sm font-medium">
            Scroll Mode
          </button>
          <button onClick={() => setMode('read')} className="px-4 py-2 bg-black/50 rounded-full hover:bg-black/70 text-sm font-medium">
            Read Mode
          </button>
          <button onClick={() => navigate('/')} className="p-2 bg-black/50 rounded-full hover:bg-black/70">
            <X size={24} />
          </button>
        </div>

        {/* Scene Content */}
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentScene.id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 1000 : -1000,
                opacity: 0
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1
              },
              exit: (dir: number) => ({
                zIndex: 0,
                x: dir < 0 ? 1000 : -1000,
                opacity: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 overflow-hidden bg-black"
          >
            {/* Click zones for navigation */}
            <div className="absolute inset-0 z-40 flex pointer-events-none">
              <div className="w-1/3 h-full cursor-pointer pointer-events-auto" onClick={handlePrev} />
              <div className="w-2/3 h-full cursor-pointer pointer-events-auto" onClick={handleNext} />
            </div>

            <div className="absolute inset-0">
              <SimpleHistoryBackground bgClass={currentScene.bgClass || 'bg-gradient-to-tr from-zinc-800 to-zinc-950'} />
              <div className="absolute inset-0 particles-overlay opacity-30 pointer-events-none mix-blend-screen" />
            </div>

            {/* Character Animation Overlay */}
            {currentScene.lottieUrl ? (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                  <LottiePlayer url={currentScene.lottieUrl} />
               </div>
            ) : currentScene.characterUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                <motion.img
                  src={currentScene.characterUrl}
                  alt="Character"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                  initial={
                    currentScene.animationType === 'slide-in' ? { x: -300, opacity: 0 } :
                    currentScene.animationType === 'spin' ? { rotate: -180, scale: 0 } :
                    { opacity: 0 }
                  }
                  animate={
                    currentScene.animationType === 'bob' ? { y: [0, -15, 0], opacity: 1 } :
                    currentScene.animationType === 'shake' ? { x: [-5, 5, -5, 5, 0], opacity: 1 } :
                    currentScene.animationType === 'slide-in' ? { x: 0, opacity: 1 } :
                    currentScene.animationType === 'spin' ? { rotate: 0, scale: 1, opacity: 1 } :
                    currentScene.animationType === 'pulse' ? { scale: [1, 1.1, 1], opacity: 1 } :
                    { opacity: 1 }
                  }
                  transition={
                    currentScene.animationType === 'bob' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } :
                    currentScene.animationType === 'shake' ? { duration: 0.4, repeat: Infinity } :
                    currentScene.animationType === 'slide-in' ? { duration: 0.8, type: 'spring', bounce: 0.4 } :
                    currentScene.animationType === 'spin' ? { duration: 0.6, type: 'spring' } :
                    currentScene.animationType === 'pulse' ? { duration: 1, repeat: Infinity } :
                    { duration: 0.5 }
                  }
                />
              </div>
            )}

            <div className="absolute inset-0 z-50 flex flex-col justify-end p-6 pb-24 md:p-12 pointer-events-none">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl mx-auto w-full text-center"
              >
                {currentScene.altHistoryText && (
                  <span className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {currentScene.altHistoryText}
                  </span>
                )}

                <p className="text-2xl md:text-4xl font-serif text-white drop-shadow-lg leading-snug">
                  {currentScene.text}
                </p>

                {currentScene.choices && (
                  <div className="mt-8 flex flex-col gap-4 pointer-events-auto">
                    {currentScene.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={(e) => { e.stopPropagation(); handleChoice(choice); }}
                        className="w-full p-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-colors text-left"
                      >
                        <p className="text-lg">{choice.text}</p>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Paywall Overlay */}
        <AnimatePresence>
          {showPaywall && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto"
            >
              <div className="text-center max-w-md">
                <Lock className="w-16 h-16 mx-auto mb-6 text-red-500" />
                <h3 className="text-3xl font-bold mb-4">The story continues...</h3>
                <p className="text-zinc-400 mb-8">
                  Unlock the rest of this epic historical event and discover what happens next.
                </p>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors flex items-center justify-center gap-2">
                  <PlayCircle /> Watch Ad to Continue
                </button>
                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors">
                  Subscribe Premium
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (mode === 'read') {
    return (
      <div className="bg-[#f4ebd8] min-h-[100dvh] w-full text-zinc-900 pb-24">
         <div className="sticky top-0 w-full z-50 bg-[#f4ebd8]/90 backdrop-blur-md border-b border-amber-900/10 flex justify-between p-4">
           <div className="flex gap-4">
            <button onClick={() => setMode('story')} className="px-4 py-2 bg-amber-900/10 rounded-full hover:bg-amber-900/20 text-sm font-medium">
              Story Mode
            </button>
            <button onClick={() => setMode('scroll')} className="px-4 py-2 bg-amber-900/10 rounded-full hover:bg-amber-900/20 text-sm font-medium">
              Scroll Mode
            </button>
           </div>
           <div className="flex gap-4 items-center">
             <button onClick={toggleMute} className="p-2 bg-amber-900/10 rounded-full hover:bg-amber-900/20 text-amber-900">
               {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
             <button onClick={() => navigate('/')} className="p-2 bg-amber-900/10 rounded-full hover:bg-amber-900/20">
               <X size={24} />
             </button>
           </div>
        </div>

        <div className="max-w-3xl mx-auto p-6 md:p-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-amber-950 mb-4"
          >
            {story.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-amber-900/70 mb-12 italic"
          >
            {story.description}
          </motion.p>

          <div className="space-y-16">
            {scenePath.map((scene, i) => (
              <motion.div
                key={`${scene.id}-${i}`}
                id={`scene-${scene.id}`}
                className="prose prose-amber lg:prose-xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className={`w-full rounded-2xl shadow-xl mb-8 aspect-video overflow-hidden relative bg-[length:200%_200%] animate-bg-pan ${scene.bgClass || 'bg-gradient-to-tr from-zinc-800 to-zinc-950'}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {scene.characterUrl && !scene.lottieUrl && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                       <motion.img
                         src={scene.characterUrl}
                         alt="Character"
                         className="w-1/2 h-1/2 object-contain"
                         animate={
                           scene.animationType === 'bob' ? { y: [0, -10, 0] } :
                           scene.animationType === 'shake' ? { x: [-3, 3, -3, 3, 0] } :
                           scene.animationType === 'pulse' ? { scale: [1, 1.05, 1] } :
                           {}
                         }
                         transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                       />
                     </div>
                  )}
                  {scene.lottieUrl && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 scale-[0.6]">
                        <LottiePlayer url={scene.lottieUrl} />
                     </div>
                  )}
                </motion.div>

                {scene.altHistoryText && (
                  <span className="inline-block bg-purple-100 text-purple-900 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-purple-200">
                    {scene.altHistoryText}
                  </span>
                )}

                <p className="text-2xl font-serif leading-relaxed text-zinc-800">
                  {i === 0 && <span className="float-left text-7xl font-serif pr-4 pt-2 text-amber-900">{scene.text.charAt(0)}</span>}
                  {i === 0 ? scene.text.slice(1) : scene.text}
                </p>

                {scene.choices && i === scenePath.length - 1 && (
                   <div className="mt-12 p-8 bg-amber-900/5 rounded-2xl border border-amber-900/10">
                     <h3 className="text-xl font-bold text-amber-950 mb-6 text-center">What happens next?</h3>
                     <div className="flex flex-col gap-4">
                       {scene.choices.map((choice) => (
                         <button
                           key={choice.id}
                           onClick={() => handleReadScrollChoice(choice)}
                           className="w-full p-4 bg-white shadow-sm border border-amber-900/10 rounded-xl hover:bg-amber-50 transition-colors text-amber-950 font-medium"
                         >
                           {choice.text}
                         </button>
                       ))}
                     </div>
                   </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Paywall Overlay */}
        {showPaywall && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-white">
              <div className="text-center max-w-md">
                <Lock className="w-16 h-16 mx-auto mb-6 text-red-500" />
                <h3 className="text-3xl font-bold mb-4">The story continues...</h3>
                <p className="text-zinc-400 mb-8">
                  Unlock the rest of this epic historical event and discover what happens next.
                </p>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors flex items-center justify-center gap-2">
                  <PlayCircle /> Watch Ad to Continue
                </button>
                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors">
                  Subscribe Premium
                </button>
              </div>
            </div>
          )}
      </div>
    );
  }

  if (mode === 'scroll') {
    return (
      <div className="bg-black text-white h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory relative">
        <div className="fixed top-8 right-4 z-50 flex gap-4 items-center">
          <button onClick={toggleMute} className="p-2 bg-black/50 rounded-full hover:bg-black/70 text-white">
             {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button onClick={() => setMode('story')} className="px-4 py-2 bg-black/50 rounded-full hover:bg-black/70 text-sm font-medium">
            Story Mode
          </button>
          <button onClick={() => setMode('read')} className="px-4 py-2 bg-black/50 rounded-full hover:bg-black/70 text-sm font-medium">
            Read Mode
          </button>
          <button onClick={() => navigate('/')} className="p-2 bg-black/50 rounded-full hover:bg-black/70">
            <X size={24} />
          </button>
        </div>

        {scenePath.map((scene, i) => (
          <div key={`${scene.id}-${i}`} id={`scroll-scene-${scene.id}`} className="h-[100dvh] w-full snap-start relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 overflow-hidden">
              <SimpleHistoryBackground bgClass={scene.bgClass || 'bg-gradient-to-tr from-zinc-800 to-zinc-950'} />
              <div className="absolute inset-0 particles-overlay opacity-30 pointer-events-none mix-blend-screen" />
            </div>

            {/* Character Animation Overlay for Scroll Mode */}
            {scene.lottieUrl ? (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <LottiePlayer url={scene.lottieUrl} />
               </div>
            ) : scene.characterUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <motion.img
                  src={scene.characterUrl}
                  alt="Character"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                  initial={
                    scene.animationType === 'slide-in' ? { x: -300, opacity: 0 } :
                    scene.animationType === 'spin' ? { rotate: -180, scale: 0 } :
                    { opacity: 0 }
                  }
                  whileInView={
                    scene.animationType === 'bob' ? { y: [0, -15, 0], opacity: 1 } :
                    scene.animationType === 'shake' ? { x: [-5, 5, -5, 5, 0], opacity: 1 } :
                    scene.animationType === 'slide-in' ? { x: 0, opacity: 1 } :
                    scene.animationType === 'spin' ? { rotate: 0, scale: 1, opacity: 1 } :
                    scene.animationType === 'pulse' ? { scale: [1, 1.1, 1], opacity: 1 } :
                    { opacity: 1 }
                  }
                  transition={
                    scene.animationType === 'bob' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } :
                    scene.animationType === 'shake' ? { duration: 0.4, repeat: Infinity } :
                    scene.animationType === 'slide-in' ? { duration: 0.8, type: 'spring', bounce: 0.4 } :
                    scene.animationType === 'spin' ? { duration: 0.6, type: 'spring' } :
                    scene.animationType === 'pulse' ? { duration: 1, repeat: Infinity } :
                    { duration: 0.5 }
                  }
                />
              </div>
            )}

            <motion.div
               className="relative z-30 p-8 w-full max-w-2xl mx-auto flex flex-col justify-end h-full pb-24 text-center pointer-events-none"
               initial={{ y: 50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
            >
               {scene.altHistoryText && (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    transition={{ duration: 0.4 }}
                    className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 self-center pointer-events-auto"
                  >
                    {scene.altHistoryText}
                  </motion.span>
                )}
                <p className="text-2xl md:text-4xl font-serif text-white drop-shadow-lg leading-snug">
                  {scene.text}
                </p>

                {scene.choices && i === scenePath.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 flex flex-col gap-4 pointer-events-auto"
                  >
                    {scene.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => {
                            handleReadScrollChoice(choice);
                            setTimeout(() => {
                                const element = document.getElementById(`scroll-scene-${choice.nextSceneId}`);
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}
                        className="w-full p-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-colors"
                      >
                        <p className="text-lg">{choice.text}</p>
                      </button>
                    ))}
                  </motion.div>
                )}
            </motion.div>
            <div id={`scene-${scene.id}`} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
          </div>
        ))}

         {/* Paywall Overlay for scroll mode if needed */}
         {showPaywall && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <Lock className="w-16 h-16 mx-auto mb-6 text-red-500" />
                <h3 className="text-3xl font-bold mb-4">The story continues...</h3>
                <p className="text-zinc-400 mb-8">
                  Unlock the rest of this epic historical event and discover what happens next.
                </p>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors flex items-center justify-center gap-2">
                  <PlayCircle /> Watch Ad to Continue
                </button>
                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors">
                  Subscribe Premium
                </button>
              </div>
            </div>
          )}
      </div>
    );
  }

  return null;
}
