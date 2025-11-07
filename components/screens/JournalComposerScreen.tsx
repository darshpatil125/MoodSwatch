import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JournalEntry } from '../../types';
import GlassCard from '../ui/GlassCard';
import { ArrowLeftIcon, SparklesIcon, BrainCircuitIcon } from '../icons/Icons';
import Loader from '../ui/Loader';

interface JournalComposerScreenProps {
  entry: JournalEntry | null;
  updateEntry: (entry: JournalEntry) => void;
  navigateTo: (screen: 'home') => void;
  generateTags: (entry: JournalEntry) => Promise<void>;
  generateReframe: (entry: JournalEntry) => Promise<void>;
}

const JournalComposerScreen: React.FC<JournalComposerScreenProps> = ({ entry, updateEntry, navigateTo, generateTags, generateReframe }) => {
  const [text, setText] = useState(entry?.free_text || '');
  const [isTagging, setIsTagging] = useState(false);
  const [isReframing, setIsReframing] = useState(false);

  useEffect(() => {
    if (entry) {
        setText(entry.free_text || '');
    }
  }, [entry]);

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No entry selected.</p>
        <button onClick={() => navigateTo('home')}>Go Home</button>
      </div>
    );
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleBlur = () => {
    updateEntry({ ...entry, free_text: text });
  };
  
  const handleGenerateTags = async () => {
    handleBlur();
    setIsTagging(true);
    await generateTags({...entry, free_text: text});
    setIsTagging(false);
  };
  
  const handleGenerateReframe = async () => {
    handleBlur();
    setIsReframing(true);
    await generateReframe({...entry, free_text: text});
    setIsReframing(false);
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="py-8"
    >
      <header className="flex items-center justify-between">
        <button onClick={() => navigateTo('home')} className="p-2 -ml-2">
          <ArrowLeftIcon />
        </button>
        <div className="flex items-center space-x-2">
            <span className="text-5xl">{entry.mood_emoji}</span>
            <span className="text-2xl font-bold">{entry.intensity}/10</span>
        </div>
        <div className="w-8"></div>
      </header>

      <GlassCard className="mt-8 p-1">
        <textarea
          value={text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="pour your vibe here..."
          className="w-full h-48 bg-transparent text-dawn-text dark:text-dusk-text placeholder-dawn-text/50 dark:placeholder-dusk-text/50 resize-none focus:outline-none text-lg leading-relaxed p-4"
        />
      </GlassCard>

      <div className="mt-6 space-y-4">
         <div className="flex space-x-4">
            <button
                onClick={handleGenerateTags}
                disabled={!text || isTagging || isReframing}
                className="w-full flex items-center justify-center space-x-2 py-3 text-center rounded-2xl bg-white/60 dark:bg-black/20 font-semibold disabled:opacity-50 transition-opacity"
            >
                {isTagging ? <Loader /> : <SparklesIcon />}
                <span>Auto-Tag</span>
            </button>
            <button
                onClick={handleGenerateReframe}
                disabled={!text || isReframing || isTagging}
                className="w-full flex items-center justify-center space-x-2 py-3 text-center rounded-2xl bg-white/60 dark:bg-black/20 font-semibold disabled:opacity-50 transition-opacity"
            >
                {isReframing ? <Loader /> : <BrainCircuitIcon />}
                <span>Reframe</span>
            </button>
        </div>
        {entry.tags.length > 0 && (
             <GlassCard className="p-4">
                <h3 className="font-semibold mb-2 text-sm opacity-80">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-dawn-accent/10 dark:bg-dusk-accent/10 text-dawn-accent dark:text-dusk-accent text-sm rounded-full font-medium">{tag}</span>
                    ))}
                </div>
            </GlassCard>
        )}
         {entry.ai_reframe && (
            <GlassCard className="p-4 space-y-4">
                 <div>
                    <h3 className="font-semibold text-sm mb-1 text-dawn-accent dark:text-dusk-accent">A Kinder Lens</h3>
                    <p className="text-base italic leading-relaxed">"{entry.ai_reframe}"</p>
                </div>
                {entry.ai_micro_action && (
                    <div>
                        <h3 className="font-semibold text-sm mb-1 text-dawn-accent dark:text-dusk-accent">One Tiny Action</h3>
                        <p className="text-base leading-relaxed">{entry.ai_micro_action}</p>
                    </div>
                )}
            </GlassCard>
        )}
      </div>

    </motion.div>
  );
};

export default JournalComposerScreen;