import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, PlayCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Choice, Scene, Story } from '../types';
import { audioManager } from '../lib/audio';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

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
      setCurrentSceneId(story.scenes[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (showPaywall) return;

    const prevIndex = story.scenes.findIndex(s => s.id === currentSceneId) - 1;
    if (prevIndex >= 0) {
      setCurrentSceneId(story.scenes[prevIndex].id);
    }
  };

  const handleChoice = (choice: Choice) => {
    if (!isMuted) audioManager.playClick();
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Click zones for navigation */}
            <div className="absolute inset-0 z-40 flex pointer-events-none">
              <div className="w-1/3 h-full cursor-pointer pointer-events-auto" onClick={handlePrev} />
              <div className="w-2/3 h-full cursor-pointer pointer-events-auto" onClick={handleNext} />
            </div>
            <div className="absolute inset-0">
              <img
                src={currentScene.imageUrl}
                alt="Scene background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

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
                <motion.img
                  src={scene.imageUrl}
                  alt="Historical depiction"
                  className="w-full rounded-2xl shadow-xl mb-8 object-cover aspect-video"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />

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
             <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
             >
              <img
                src={scene.imageUrl}
                alt="Scene background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </motion.div>

            <motion.div
               className="relative z-10 p-8 w-full max-w-2xl mx-auto flex flex-col justify-end h-full pb-24 text-center"
               initial={{ y: 50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
            >
               {scene.altHistoryText && (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    transition={{ duration: 0.4 }}
                    className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 self-center"
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
                    className="mt-8 flex flex-col gap-4"
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
