export type Mode = 'scroll' | 'read' | 'story';

export interface Choice {
  id: string;
  text: string;
  isHistorical: boolean;
  nextSceneId: string;
}

export interface Scene {
  id: string;
  text: string;
  imageUrl: string;
  bgClass?: string;
  characterUrl?: string;
  lottieUrl?: string;
  animationType?: 'bob' | 'shake' | 'slide-in' | 'spin' | 'pulse';
  isCliffhanger?: boolean;
  choices?: Choice[];
  altHistoryText?: string;
  isEnding?: boolean;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  scenes: Scene[];
}

export interface Category {
  id: string;
  title: string;
  stories: Story[];
}
