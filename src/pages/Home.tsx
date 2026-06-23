import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import Lottie from 'lottie-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LottieComponent = (Lottie as any).default || Lottie;
import { motion } from 'framer-motion';
import loadingAnimation from '../assets/lottie/loading.json';
import accentAnimation from '../assets/lottie/accent.json';
import type { Category, Story } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch from local API, but immediately fall back to mock data
    // to ensure 100% offline functionality.
    import('../data/mockData').then((mockData) => {
        const data = mockData.mockCategories;
        setCategories(data);
        if (data[0]?.stories?.length > 0) {
          setFeaturedStory(data[0].stories[0]);
        }
        setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
        <LottieComponent animationData={loadingAnimation} loop={true} className="w-48 h-48 mb-4" />
        <p className="text-xl font-bold tracking-widest text-zinc-400">LOADING HISTORY...</p>
      </div>
    );
  }

  if (!featuredStory) return (
    <div className="min-h-screen bg-rome-900 text-rome-100 flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h2 className="text-3xl font-playfair mb-4 text-rome-300">Story Not Found</h2>
        <p className="text-rome-200 mb-6">We couldn't load the featured story. Please try refreshing.</p>
      </div>
    </div>
  );

  return (
    <div className="pb-20 bg-zinc-950">
      {/* Navbar (mock) */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent px-4 py-6 md:px-12 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-rome-gold tracking-widest font-serif drop-shadow-lg">HISTORIA</h1>
        <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wide text-zinc-300">
          <a href="#" className="text-white border-b-2 border-rome-gold pb-1 transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Empires</a>
          <a href="#" className="hover:text-white transition-colors">Battles</a>
          <a href="#" className="hover:text-white transition-colors">My List</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden bg-rome-dark">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated procedural background matching the theme */}
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-gradient-to-br from-rome-accent/30 via-black to-rome-gold/10"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rome-gold/10 via-zinc-900/90 to-black" />
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            src={featuredStory.thumbnailUrl}
            alt={featuredStory.title}
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
            onError={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>

        {/* Decorative Lottie Accent */}
        <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] opacity-40 pointer-events-none mix-blend-screen">
            <LottieComponent animationData={accentAnimation} loop={true} />
        </div>

        <div className="absolute bottom-0 left-0 px-4 md:px-12 pb-32 max-w-3xl z-10">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}>
            <span className="text-rome-gold font-bold tracking-[0.2em] text-sm mb-6 block flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-rome-gold animate-pulse shadow-[0_0_10px_rgba(194,155,78,0.8)]" />
              FEATURED HISTORY
            </span>
            <h2 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl font-serif leading-tight">{featuredStory.title}</h2>
            <p className="text-lg md:text-xl text-zinc-300 mb-10 line-clamp-3 leading-relaxed border-l-2 border-rome-gold pl-6 bg-gradient-to-r from-black/40 to-transparent py-2 rounded-r max-w-2xl">
              {featuredStory.description}
            </p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate(`/story/${featuredStory.id}`)}
              className="group flex items-center gap-3 bg-rome-gold text-rome-dark px-8 py-4 rounded-full md:text-lg font-bold hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(194,155,78,0.4)] hover:shadow-[0_0_30px_rgba(194,155,78,0.6)] hover:scale-105"
            >
              <Play className="fill-rome-dark group-hover:scale-110 transition-transform" size={24} />
              Experience Story
            </button>
            <button className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md text-white px-8 py-4 rounded-full md:text-lg font-bold hover:bg-zinc-800 transition-all border border-zinc-700 hover:border-rome-gold hover:scale-105">
              <Info size={24} className="text-rome-gold" />
              Read Lore
            </button>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 md:px-12 -mt-24 relative z-20 space-y-20 pb-20">
        {categories.map((category: Category, index: number) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white font-serif flex items-center gap-4">
              <span className="w-8 h-[2px] bg-rome-gold" />
              {category.title}
            </h3>
            <div className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide snap-x pt-4 px-2 -mx-2">
              {category.stories.map((story: Story) => (
                <motion.div
                  key={story.id}
                  onClick={() => navigate(`/story/${story.id}`)}
                  className="relative flex-none w-[280px] md:w-[360px] aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group snap-start bg-zinc-900 border border-zinc-800/50 shadow-2xl"
                  whileHover={{ y: -15, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Fallback gradient if image fails */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-rome-dark" />
                  <img
                    src={story.thumbnailUrl}
                    alt=""
                    className="relative z-10 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-20">
                    <p className="font-bold text-2xl md:text-3xl text-white font-serif mb-3 drop-shadow-xl leading-tight">
                      {story.title}
                    </p>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <div className="bg-rome-gold rounded-full p-2">
                         <Play size={16} className="fill-rome-dark text-rome-dark" />
                      </div>
                      <span className="text-rome-gold font-semibold tracking-wide text-sm uppercase">Start Journey</span>
                    </div>
                  </div>
                  {/* Hover effect accent inner shadow */}
                  <div className="absolute inset-0 ring-inset ring-2 ring-transparent group-hover:ring-rome-gold/50 rounded-2xl transition-all duration-500 z-30 pointer-events-none shadow-[inset_0_0_0_rgba(0,0,0,0)] group-hover:shadow-[inset_0_0_50px_rgba(194,155,78,0.2)]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
