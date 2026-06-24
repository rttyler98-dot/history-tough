import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory mock database (could be swapped for MongoDB, Supabase, etc)
const db = {
  stories: [
    {
      id: 'fall-of-caesar',
      title: 'The Fall of Caesar',
      description: 'The ides of march approaches. Betrayal lurks in the shadows of the Senate. Will you survive the greatest conspiracy of Rome?',
      thumbnailUrl: 'https://images.unsplash.com/photo-1548625361-ec853f080275?auto=format&fit=crop&q=80&w=1200&h=800',
      category: 'Trending: Betrayals',
      scenes: [
        {
          id: 'scene-1',
          text: 'Rome, 44 BC. You are Julius Caesar, Dictator in Perpetuity. The people cheer your name, but whispers echo in the marble halls of the Senate.',
          imageUrl: 'https://images.unsplash.com/photo-1622359487965-da255b719ee2?auto=format&fit=crop&q=80&w=1080&h=1920',
          bgClass: 'bg-gradient-to-br from-amber-200 via-orange-300 to-amber-500',
          characterUrl: '/caesar.svg',
          animationType: 'bob',
          locationType: 'city'
        },
        {
          id: 'scene-2',
          text: 'Your wife Calpurnia wakes up screaming. "I saw your statue pouring blood!" she cries. "Do not go to the Senate today!"',
          imageUrl: 'https://images.unsplash.com/photo-1555581977-1c607ab18c94?auto=format&fit=crop&q=80&w=1080&h=1920',
          bgClass: 'bg-gradient-to-tl from-indigo-900 via-purple-900 to-zinc-900',
          characterUrl: '/calpurnia.svg',
          animationType: 'shake',
          locationType: 'indoor',
          choices: [
            {
              id: 'go-senate',
              text: 'I am Caesar. I fear no dreams. (Go to Senate)',
              isHistorical: true,
              nextSceneId: 'scene-3-historical'
            },
            {
              id: 'stay-home',
              text: 'Perhaps the gods warn me. (Stay Home)',
              isHistorical: false,
              nextSceneId: 'scene-3-alt'
            }
          ]
        },
        {
          id: 'scene-3-historical',
          text: 'You arrive at the Theatre of Pompey. The senators surround you. Casca grabs your toga. "Vile Casca, what are you doing?!"',
          imageUrl: 'https://images.unsplash.com/photo-1599813247050-8b1e16f39eec?auto=format&fit=crop&q=80&w=1080&h=1920',
          bgClass: 'bg-gradient-to-tr from-stone-400 via-neutral-300 to-stone-500',
          characterUrl: '/senator.svg',
          animationType: 'slide-in',
          locationType: 'indoor',
          isCliffhanger: true,
        },
        {
          id: 'scene-4-historical',
          text: 'Blades flash. Even Brutus, your trusted friend, strikes. "Et tu, Brute?" You cover face with your toga and fall.',
          imageUrl: 'https://images.unsplash.com/photo-1605330384877-03306ce08eeb?auto=format&fit=crop&q=80&w=1080&h=1920',
          bgClass: 'bg-gradient-to-br from-red-900 via-red-700 to-black',
          characterUrl: '/brutus.svg',
          animationType: 'pulse',
          locationType: 'indoor',
          isEnding: true,
        },
        {
          id: 'scene-3-alt',
          altHistoryText: 'Alternate History unlocked!',
          text: 'You stay home. The conspirators wait for hours, growing panicked. Antony discovers the plot and arrests Brutus and Cassius.',
          imageUrl: 'https://images.unsplash.com/photo-1582266858167-932d201201ce?auto=format&fit=crop&q=80&w=1080&h=1920',
          bgClass: 'bg-gradient-to-bl from-teal-900 via-emerald-800 to-stone-900',
          characterUrl: '/senator.svg',
          animationType: 'spin',
          locationType: 'village',
          isEnding: true,
        }
      ]
    },
    {
      id: 'cleopatra',
      title: 'The Last Pharaoh',
      description: 'Love, power, and snakes. The incredible final days of Cleopatra.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1599516664977-703f8e434f3c?auto=format&fit=crop&q=80&w=1200&h=800',
      category: 'Trending: Betrayals',
      scenes: [
        {
          id: 'scene-1',
          text: 'Coming soon...',
          imageUrl: 'https://images.unsplash.com/photo-1599516664977-703f8e434f3c?auto=format&fit=crop&q=80&w=1080&h=1920',
          isEnding: true
        }
      ]
    },
    {
      id: 'thermopylae',
      title: 'The 300 Spartans',
      description: 'Stand your ground. For Sparta!',
      thumbnailUrl: 'https://images.unsplash.com/photo-1533152643793-ecf05e94b150?auto=format&fit=crop&q=80&w=1200&h=800',
      category: 'Epic Battles',
      scenes: [
        {
          id: 'scene-1',
          text: 'Coming soon...',
          imageUrl: 'https://images.unsplash.com/photo-1533152643793-ecf05e94b150?auto=format&fit=crop&q=80&w=1080&h=1920',
          isEnding: true
        }
      ]
    }
  ]
};

const categories = [
  {
    id: 'trending',
    title: 'Trending: Betrayals',
    stories: db.stories.filter(s => s.category === 'Trending: Betrayals')
  },
  {
    id: 'epic',
    title: 'Epic Battles',
    stories: db.stories.filter(s => s.category === 'Epic Battles')
  }
];

// API Routes
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/stories/:id', (req, res) => {
  const story = db.stories.find(s => s.id === req.params.id);
  if (story) {
    res.json(story);
  } else {
    res.status(404).json({ message: 'Story not found' });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
