import re

mock_data_path = 'src/data/mockData.ts'
server_data_path = 'server/index.ts'

new_scenes = """    scenes: [
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
        text: 'You heed Calpurnia\\'s warning. In the Senate, the conspirators sweat as hours pass. Antony uncovers the plot, and the treason is met with swift, brutal justice. Rome is yours, forever.',
        theme: 'triumph',
        lottieAsset: 'crown',
        isEnding: true,
      }
    ]"""

def replace_scenes(filepath, is_server=False):
    with open(filepath, 'r') as f:
        content = f.read()

    parts = content.split("id: 'cleopatra'")
    if len(parts) == 2:
        caesar_part = parts[0]
        cleopatra_part = parts[1]

        # Carefully extract the portion before the scenes list starts
        # and after it ends to cleanly replace just the array.
        # Find where scenes: [ starts and the matching ] ends.

        scenes_start = caesar_part.find('scenes: [')

        if scenes_start != -1:
            prefix = caesar_part[:scenes_start]

            # Use regex carefully to avoid quoting issues
            new_scenes_str = new_scenes
            if is_server:
                new_scenes_str = new_scenes_str.replace("theme: 'senate',", "imageUrl: 'https://images.unsplash.com/photo-1622359487965-da255b719ee2?auto=format&fit=crop&q=80&w=1080&h=1920',")
                new_scenes_str = new_scenes_str.replace("lottieAsset: 'senator',", "")
                new_scenes_str = new_scenes_str.replace("theme: 'bedroom',", "imageUrl: 'https://images.unsplash.com/photo-1555581977-1c607ab18c94?auto=format&fit=crop&q=80&w=1080&h=1920',")
                new_scenes_str = new_scenes_str.replace("lottieAsset: 'sleep',", "")
                new_scenes_str = new_scenes_str.replace("theme: 'betrayal',", "imageUrl: 'https://images.unsplash.com/photo-1605330384877-03306ce08eeb?auto=format&fit=crop&q=80&w=1080&h=1920',")
                new_scenes_str = new_scenes_str.replace("lottieAsset: 'dagger',", "")
                new_scenes_str = new_scenes_str.replace("theme: 'triumph',", "imageUrl: 'https://images.unsplash.com/photo-1582266858167-932d201201ce?auto=format&fit=crop&q=80&w=1080&h=1920',")
                new_scenes_str = new_scenes_str.replace("lottieAsset: 'crown',", "")

            with open(filepath, 'w') as f:
                f.write(prefix + new_scenes_str + ",\n  },\n  {\n    id: 'cleopatra'" + cleopatra_part)

replace_scenes(mock_data_path)
replace_scenes(server_data_path, is_server=True)
