import { motion } from 'framer-motion';

interface Props {
  theme?: 'senate' | 'bedroom' | 'betrayal' | 'triumph' | 'egypt' | 'sparta';
}

export default function DynamicSceneBackground({ theme }: Props) {
  let backgroundImage: string | undefined;
  switch(theme) {
    case 'senate':
      backgroundImage = '/senate.svg';
      break;
    case 'bedroom':
      backgroundImage = '/bedroom.svg';
      break;
    case 'betrayal':
      backgroundImage = '/betrayal.svg';
      break;
    case 'triumph':
      backgroundImage = '/triumph.svg';
      break;
    default:
      backgroundImage = '';
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-900">
      {backgroundImage ? (
         <motion.div
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: `url(${backgroundImage})` }}
           initial={{ scale: 1.05 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1.5, ease: 'easeOut' }}
         >
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
         </motion.div>
      ) : (
         <>
          <motion.div
             className="absolute inset-0 opacity-20"
             style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}
             animate={{ backgroundPosition: ['0px 0px, 30px 30px', '60px 60px, 90px 90px'] }}
             transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        </>
      )}
    </div>
  );
}
