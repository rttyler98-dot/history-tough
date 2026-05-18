import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, PlayCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockStories } from '../data/mockData';
import type { Choice } from '../types';

export default function StoryPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const story = mockStories.find((s) => s.id === id);

  const [currentSceneId, setCurrentSceneId] = useState(story?.scenes[0]?.id);
  const [mode, setMode] = useState<'story' | 'scroll' | 'read'>('story');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (story) {
      const scene = story.scenes.find((s) => s.id === currentSceneId);
      if (scene?.isCliffhanger) {
        // Show paywall after a short dramatic pause
        const timer = setTimeout(() => setShowPaywall(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentSceneId, story]);

  if (!story) {
    return <div className="p-8 text-center">Story not found.</div>;
  }

  const currentScene = story.scenes.find((s) => s.id === currentSceneId) || story.scenes[0];

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
    setCurrentSceneId(choice.nextSceneId);
  };

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
        <div className="absolute top-8 right-4 z-50 flex gap-4">
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
          <button onClick={() => navigate('/')} className="p-2 bg-amber-900/10 rounded-full hover:bg-amber-900/20">
            <X size={24} />
          </button>
        </div>

        <div className="max-w-3xl mx-auto p-6 md:p-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-950 mb-4">{story.title}</h1>
          <p className="text-xl text-amber-900/70 mb-12 italic">{story.description}</p>

          <div className="space-y-16">
            {story.scenes.map((scene, i) => (
              <div key={scene.id} className="prose prose-amber lg:prose-xl mx-auto">
                <img
                  src={scene.imageUrl}
                  alt="Historical depiction"
                  className="w-full rounded-2xl shadow-xl mb-8 object-cover aspect-video"
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

                {scene.choices && (
                   <div className="mt-12 p-8 bg-amber-900/5 rounded-2xl border border-amber-900/10">
                     <h3 className="text-xl font-bold text-amber-950 mb-6 text-center">What happens next?</h3>
                     <div className="flex flex-col gap-4">
                       {scene.choices.map((choice) => (
                         <button
                           key={choice.id}
                           className="w-full p-4 bg-white shadow-sm border border-amber-900/10 rounded-xl hover:bg-amber-50 transition-colors text-amber-950 font-medium"
                         >
                           {choice.text}
                         </button>
                       ))}
                     </div>
                   </div>
                )}
              </div>
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
        <div className="fixed top-8 right-4 z-50 flex gap-4">
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

        {story.scenes.map((scene) => (
          <div key={scene.id} className="h-[100dvh] w-full snap-start relative flex items-center justify-center">
             <div className="absolute inset-0">
              <img
                src={scene.imageUrl}
                alt="Scene background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 p-8 w-full max-w-2xl mx-auto flex flex-col justify-end h-full pb-24 text-center">
               {scene.altHistoryText && (
                  <span className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 self-center">
                    {scene.altHistoryText}
                  </span>
                )}
                <p className="text-2xl md:text-4xl font-serif text-white drop-shadow-lg leading-snug">
                  {scene.text}
                </p>

                {scene.choices && (
                  <div className="mt-8 flex flex-col gap-4">
                    {scene.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => {
                            // In scroll mode, making a choice could just scroll to the next scene or filter scenes.
                            // For MVP we just alert as scroll mode implies linear viewing usually, but let's navigate to it by ID.
                            const element = document.getElementById(`scroll-scene-${choice.nextSceneId}`);
                            element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full p-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-colors"
                      >
                        <p className="text-lg">{choice.text}</p>
                      </button>
                    ))}
                  </div>
                )}
            </div>
            <div id={`scroll-scene-${scene.id}`} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
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
