
import { JournalEntry, MoodEmoji } from '../types';

const moods: MoodEmoji[] = ['😌', '🙂', '😐', '😟', '😣', '🤩', '🌀'];

const seedEntriesData = [
  { text: "Cramming for the physics exam. So much to cover, feeling the pressure build. Slept terribly.", tags: ["exam", "stress", "sleep_debt"], mood: '😣', intensity: 8 },
  { text: "Group project meeting was a mess. One person did nothing. Feeling frustrated and annoyed.", tags: ["group project", "frustration"], mood: '😟', intensity: 7 },
  { text: "Really missing home today. Saw a family that reminded me of mine. A little bit lonely.", tags: ["homesick", "lonely"], mood: '😟', intensity: 6 },
  { text: "Avoided starting my essay all day by cleaning my room. It's sparkling now, but the deadline is closer.", tags: ["procrastination", "anxiety"], mood: '🌀', intensity: 7 },
  { text: "Got completely lost in my coding assignment. Time just flew by. Felt so productive and capable.", tags: ["flow state", "coding", "focus"], mood: '🤩', intensity: 9 },
  { text: "It's been raining all day. Listened to sad music and just watched the drops on the window. Felt cozy.", tags: ["rain day", "cozy", "calm"], mood: '😌', intensity: 4 },
  { text: "The noise in the cafeteria was overwhelming today. Couldn't even hear my own thoughts. Had to leave.", tags: ["cafeteria noise", "overwhelmed"], mood: '🌀', intensity: 8 },
  { text: "Had a great talk with a friend. We were just laughing about stupid things. It really lifted my spirits.", tags: ["friendship", "social"], mood: '🙂', intensity: 7 },
  { text: "Aced my presentation! All the hard work paid off. I feel on top of the world.", tags: ["victory", "presentation", "confidence"], mood: '🤩', intensity: 10 },
  { text: "Just a quiet day studying in the library. Nothing special happened, but it was peaceful.", tags: ["study", "calm", "library"], mood: '😌', intensity: 5 },
];

export const generateSeedEntries = (): JournalEntry[] => {
  const now = new Date();
  return seedEntriesData.map((data, index) => {
    const timestamp = new Date(now.getTime() - index * 24 * 60 * 60 * 1000); // one entry per day
    return {
      entry_id: crypto.randomUUID(),
      timestamp_iso: timestamp.toISOString(),
      mood_emoji: data.mood as MoodEmoji,
      intensity: data.intensity,
      free_text: data.text,
      tags: data.tags,
      ai_summary: '',
      ai_reframe: '',
      ai_micro_action: '',
      study_load: Math.floor(Math.random() * 8) + 2,
      sleep_hours: Math.floor(Math.random() * 4) + 4.5,
    };
  });
};
