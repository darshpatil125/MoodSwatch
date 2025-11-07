
import { MoodEmoji } from './types';

export const MOODS: { emoji: MoodEmoji; label: string }[] = [
  { emoji: '🤩', label: 'Amazing' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😟', label: 'Uneasy' },
  { emoji: '😣', label: 'Stressed' },
  { emoji: '🌀', label: 'Overwhelmed' },
];

export const QUICK_PROMPTS = [
  "What's one small moment of peace from today?",
  "What color is your mood right now?",
  "If today had a soundtrack, what's one song on it?",
  "What's taking up most of your headspace?",
  "A tiny win from today was...",
  "One thing I'm letting go of is...",
];
