import type { Story, Category } from '../types';

export const mockStories: Story[] = [
  {
    id: 'fall-of-caesar',
    title: 'The Fall of Caesar',
    description: 'The ides of march approaches. Betrayal lurks in the shadows of the Senate. Will you survive the greatest conspiracy of Rome?',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548625361-ec853f080275?auto=format&fit=crop&q=80&w=1200&h=800',
    category: 'Trending: Betrayals',
                scenes: [
      {
        id: 'scene-1',
        text: 'Rome, 44 BC. The air in the Senate is thick with unspoken tension. You are Julius Caesar, Dictator in Perpetuity. As you walk the marble halls, the silence is deafening.',
        theme: 'senate',
        lottieAsset: 'senator',
        choices: [
          { id: 'c1', text: 'Continue walking', nextSceneId: 'scene-1-5' }
        ]
      },
      {
        id: 'scene-1-5',
        text: 'Whispers echo off the columns. A soothsayer steps from the shadows, grabbing your arm. "Beware the Ides of March," he hisses.',
        theme: 'senate',
        lottieAsset: 'dagger',
        choices: [
          { id: 'c2', text: 'Dismiss him as a fool', nextSceneId: 'scene-2' },
          { id: 'c3', text: 'Ponder his words', nextSceneId: 'scene-2' }
        ]
      },
      {
        id: 'scene-2',
        text: 'The night before the Ides. Calpurnia jolts awake, breathless. "I saw your statue pouring blood!" she cries, clutching your arm. "Do not go to the Senate today!"',
        theme: 'bedroom',
        lottieAsset: 'sleep',
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
        text: 'The Theatre of Pompey. The senators crowd around you, their faces unreadable. You spot Brutus among them, looking unusually pale.',
        theme: 'senate',
        lottieAsset: 'senator',
        choices: [
          { id: 'c4', text: 'Greet Brutus', nextSceneId: 'scene-3-5' },
          { id: 'c5', text: 'Take your seat', nextSceneId: 'scene-3-5' }
        ]
      },
      {
        id: 'scene-3-5',
        text: 'Suddenly, Tillius Cimber approaches with a petition, grasping your toga tightly. "What is this violence?" you cry out.',
        theme: 'betrayal',
        lottieAsset: 'dagger',
        choices: [
          { id: 'c6', text: 'Struggle free', nextSceneId: 'scene-3-8' }
        ]
      },
      {
        id: 'scene-3-8',
        text: 'Casca strikes the first blow from behind. The other senators surge forward like a pack of wolves, daggers drawn.',
        theme: 'betrayal',
        lottieAsset: 'dagger',
        isCliffhanger: true,
      },
      {
        id: 'scene-4-historical',
        text: 'Steel flashes in the dim light. You look up, bleeding, and see Brutus raising his blade. "Et tu, Brute?" You pull your toga over your face and welcome the dark.',
        theme: 'betrayal',
        lottieAsset: 'dagger',
        isEnding: true,
      },
      {
        id: 'scene-3-alt',
        altHistoryText: 'Alternate History unlocked!',
        text: 'You heed Calpurnia\'s warning. In the Senate, the conspirators sweat as hours pass. Antony uncovers the plot, and the treason is met with swift, brutal justice. Rome is yours, forever.',
        theme: 'triumph',
        lottieAsset: 'crown',
        isEnding: true,
      }
    ],
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
];

export const mockCategories: Category[] = [
  {
    id: 'trending',
    title: 'Trending: Betrayals',
    stories: mockStories.filter(s => s.category === 'Trending: Betrayals')
  },
  {
    id: 'epic',
    title: 'Epic Battles',
    stories: mockStories.filter(s => s.category === 'Epic Battles')
  }
];
