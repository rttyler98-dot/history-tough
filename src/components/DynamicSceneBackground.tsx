import { motion } from 'framer-motion';

interface Props {
  theme?: 'senate' | 'bedroom' | 'betrayal' | 'triumph' | 'egypt' | 'sparta';
}

export default function DynamicSceneBackground({ theme }: Props) {
  switch (theme) {
    case 'senate':
      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-900">
           {/* Marble pillar effect */}
           <div className="absolute inset-0 flex justify-around opacity-20">
             {[1,2,3,4,5].map(i => (
                <div key={i} className="w-24 h-full bg-gradient-to-b from-slate-200 via-slate-500 to-slate-800" />
             ))}
           </div>
           {/* Dynamic shadows */}
           <motion.div
             className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/50"
             animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
             transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
           />
        </div>
      );
    case 'bedroom':
      return (
        <div className="absolute inset-0 overflow-hidden bg-zinc-950">
           {/* Nighttime ambient light */}
           <motion.div
             className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] rounded-full bg-blue-900/20 blur-[100px]"
             animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
             transition={{ duration: 10, repeat: Infinity }}
           />
           {/* Subtle dust particles or starlight */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]" />
        </div>
      );
    case 'betrayal':
      return (
        <div className="absolute inset-0 overflow-hidden bg-red-950">
           {/* Pulsing red vignette */}
           <motion.div
             className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)]"
             animate={{ opacity: [0.8, 1, 0.8] }}
             transition={{ duration: 2, repeat: Infinity }}
           />
           {/* Abstract sharp shapes (knives) */}
           <motion.div
             className="absolute -right-20 top-1/4 w-96 h-20 bg-gradient-to-l from-white/20 to-transparent rotate-45 blur-md"
             animate={{ x: [-100, 100], opacity: [0, 0.5, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
           />
           <motion.div
             className="absolute -left-20 bottom-1/4 w-96 h-20 bg-gradient-to-r from-white/20 to-transparent -rotate-45 blur-md"
             animate={{ x: [100, -100], opacity: [0, 0.5, 0] }}
             transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
           />
        </div>
      );
    case 'triumph':
      return (
         <div className="absolute inset-0 overflow-hidden bg-amber-900">
           {/* Golden rays of light */}
           <div className="absolute inset-0 flex justify-center items-center">
             <motion.div
               className="w-[200%] h-[200%] bg-[conic-gradient(from_0deg,_transparent_0deg,_rgba(255,215,0,0.2)_30deg,_transparent_60deg)]"
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
             />
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
         </div>
      );
    default:
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black">
          <motion.div
             className="absolute inset-0 opacity-20"
             style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}
             animate={{ backgroundPosition: ['0px 0px, 30px 30px', '60px 60px, 90px 90px'] }}
             transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      );
  }
}
