import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import Lottie from 'lottie-react';

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

  if (!featuredStory) return null;

  return (
    <div className="pb-20">
      {/* Navbar (mock) */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent px-4 py-6 md:px-12 flex items-center gap-8">
        <h1 className="text-3xl font-bold text-red-600 tracking-tighter">HISTORIA</h1>
        <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-300">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Empires</a>
          <a href="#" className="hover:text-white transition-colors">Battles</a>
          <a href="#" className="hover:text-white transition-colors">My List</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-zinc-900 to-zinc-950">
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            src={featuredStory.thumbnailUrl}
            alt={featuredStory.title}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        {/* Decorative Lottie Accent */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 opacity-30 pointer-events-none mix-blend-screen">
            <LottieComponent animationData={accentAnimation} loop={true} />
        </div>

        <div className="absolute bottom-0 left-0 px-4 md:px-12 pb-24 max-w-2xl z-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <span className="text-amber-500 font-bold tracking-widest text-sm mb-4 block flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              FEATURED HISTORY
            </span>
            <h2 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-xl font-serif">{featuredStory.title}</h2>
            <p className="text-lg md:text-xl text-zinc-300 mb-8 line-clamp-3 border-l-4 border-amber-600 pl-4 bg-black/20 p-2 rounded-r">
              {featuredStory.description}
            </p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-4">
            <button
              onClick={() => navigate(`/story/${featuredStory.id}`)}
              className="flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-lg md:text-lg font-bold hover:bg-amber-500 transition-colors shadow-[0_0_15px_rgba(217,119,6,0.5)]"
            >
              <Play className="fill-white" size={24} />
              Experience Story
            </button>
            <button className="flex items-center gap-2 bg-zinc-800/80 text-white px-8 py-3 rounded-lg md:text-lg font-bold hover:bg-zinc-700 transition-colors border border-zinc-600">
              <Info size={24} />
              Read Lore
            </button>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 md:px-12 -mt-20 relative z-20 space-y-16 pb-12">
        {categories.map((category: Category, index: number) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white border-l-4 border-amber-600 pl-3 font-serif flex items-center gap-2">
              {category.title}
            </h3>
            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x pt-4">
              {category.stories.map((story: Story) => (
                <motion.div
                  key={story.id}
                  onClick={() => navigate(`/story/${story.id}`)}
                  className="relative flex-none w-64 md:w-80 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group snap-start bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden"
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Fallback gradient if image fails */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
                  <img
                    src={story.thumbnailUrl}
                    alt=""
                    className="relative z-10 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 p-4 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-bold text-lg md:text-xl text-white font-serif mb-1 drop-shadow-md">
                      {story.title}
                    </p>
                    <p className="text-amber-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                      <Play size={14} className="fill-amber-500" /> Start Journey
                    </p>
                  </div>
                  {/* Hover effect accent */}
                  <div className="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/50 rounded-xl transition-colors duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
