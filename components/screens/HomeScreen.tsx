import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JournalEntry, MoodEmoji } from '../../types';
import { MOODS, QUICK_PROMPTS } from '../../constants';
import GlassCard from '../ui/GlassCard';
import { formatDate, formatTime } from '../../utils/helpers';
import { ChevronRightIcon } from '../icons/Icons';

interface HomeScreenProps {
  navigateTo: (screen: 'journal', entry: JournalEntry) => void;
  addEntry: (entry: Omit<JournalEntry, 'entry_id' | 'timestamp_iso' | 'tags'>) => JournalEntry;
  entries: JournalEntry[];
}

interface MoodButtonProps {
    mood: { emoji: MoodEmoji; label: string };
    onSelect: (emoji: MoodEmoji) => void;
    isSelected: boolean;
}

const MoodButton: React.FC<MoodButtonProps> = ({ mood, onSelect, isSelected }) => (
    <motion.div
        className="flex flex-col items-center justify-start flex-shrink-0 w-20 text-center"
        whileTap={{ scale: 0.95 }}
    >
        <button
            onClick={() => onSelect(mood.emoji)}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl transition-all duration-300 relative ${isSelected ? 'bg-white dark:bg-white/10 shadow-soft dark:shadow-soft-dark' : ''}`}
        >
            {mood.emoji}
        </button>
        <span className={`mt-2 text-xs font-medium transition-opacity ${isSelected ? 'opacity-100' : 'opacity-60'}`}>{mood.label}</span>
    </motion.div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigateTo, addEntry, entries }) => {
  const [selectedMood, setSelectedMood] = useState<MoodEmoji>('🙂');
  const [intensity, setIntensity] = useState<number>(5);
  const [prompt, setPrompt] =useState('');

  useEffect(() => {
    setPrompt(QUICK_PROMPTS[Math.floor(Math.random() * QUICK_PROMPTS.length)]);
  }, []);

  const handleSave = () => {
    const newEntry = addEntry({ mood_emoji: selectedMood, intensity, free_text: prompt });
    navigateTo('journal', newEntry);
  };
  
  const recentEntries = useMemo(() => entries.slice(0, 5), [entries]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="py-12"
    >
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">hey, how are you?</h1>
        <p className="mt-2 opacity-70">quick log your current vibe below</p>
      </header>

      <GlassCard className="mt-10 p-6 overflow-hidden">
        <div className="flex overflow-x-auto space-x-2 -mx-6 px-6 no-scrollbar">
            {MOODS.map(mood => (
                <MoodButton key={mood.emoji} mood={mood} onSelect={setSelectedMood} isSelected={selectedMood === mood.emoji} />
            ))}
        </div>
        
        <div className="mt-8">
            <label htmlFor="intensity" className="block text-sm font-medium text-center mb-3">Intensity: {intensity}/10</label>
            <input
                type="range"
                id="intensity"
                min="0"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer custom-slider text-dawn-accent dark:text-dusk-accent"
            />
        </div>
      </GlassCard>

      <div className="mt-8">
        <motion.button 
            onClick={handleSave}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-4 text-center rounded-2xl bg-dawn-text dark:bg-dusk-text text-white dark:text-dawn-text font-bold shadow-lg shadow-dawn-shadow dark:shadow-dusk-shadow"
        >
            Save & Journal
        </motion.button>
      </div>

       <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">recent entries</h2>
         <div className="mt-4 space-y-3">
          {recentEntries.map(entry => (
            <motion.div key={entry.entry_id} layout>
              <GlassCard 
                onClick={() => navigateTo('journal', entry)}
                className="p-4 flex items-center justify-between cursor-pointer"
                >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{entry.mood_emoji}</div>
                  <div>
                    <p className="font-semibold">{entry.free_text ? (entry.free_text.length > 35 ? entry.free_text.substring(0, 35) + '...' : entry.free_text) : 'Quick Log'}</p>
                    <p className="text-xs opacity-60">{formatDate(entry.timestamp_iso)} at {formatTime(entry.timestamp_iso)}</p>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 opacity-40"/>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HomeScreen;