import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { mockCategories, mockStories } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const featuredStory = mockStories[0];

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
      <div className="relative h-[85vh] w-full">
        <div className="absolute inset-0">
          <img
            src={featuredStory.thumbnailUrl}
            alt={featuredStory.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 px-4 md:px-12 pb-24 max-w-2xl">
          <span className="text-red-500 font-bold tracking-widest text-sm mb-4 block">N E W   E P I S O D E</span>
          <h2 className="text-5xl md:text-7xl font-bold mb-4">{featuredStory.title}</h2>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 line-clamp-3">
            {featuredStory.description}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/story/${featuredStory.id}`)}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded md:text-lg font-bold hover:bg-white/90 transition-colors"
            >
              <Play className="fill-black" size={24} />
              Play
            </button>
            <button className="flex items-center gap-2 bg-zinc-500/50 text-white px-8 py-3 rounded md:text-lg font-bold hover:bg-zinc-500/70 transition-colors">
              <Info size={24} />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 md:px-12 -mt-12 relative z-10 space-y-12">
        {mockCategories.map((category) => (
          <div key={category.id}>
            <h3 className="text-xl md:text-2xl font-bold mb-4">{category.title}</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {category.stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => navigate(`/story/${story.id}`)}
                  className="relative flex-none w-48 md:w-72 aspect-video rounded-md overflow-hidden cursor-pointer group snap-start transition-transform hover:scale-105 hover:z-20 duration-300"
                >
                  <img
                    src={story.thumbnailUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300" />
                  <p className="absolute bottom-2 left-2 font-medium text-sm md:text-base opacity-100 group-hover:opacity-0 transition-opacity">
                    {story.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
