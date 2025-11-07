import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import HomeScreen from './components/screens/HomeScreen';
import JournalComposerScreen from './components/screens/JournalComposerScreen';
import InsightsScreen from './components/screens/InsightsScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import BottomNav from './components/BottomNav';
import { useLocalStorage } from './hooks/useLocalStorage';
import { JournalEntry, Theme } from './types';
import { generateSeedEntries } from './utils/seedData';
import { getTagsAndSummary, getReframeAndAction } from './services/geminiService';

export const ThemeContext = React.createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: 'dawn',
  toggleTheme: () => {},
});

type Screen = 'home' | 'journal' | 'insights' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journal-entries', []);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [theme, setTheme] = useLocalStorage<Theme>('journal-theme', 'dawn');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dusk');
  }, [theme]);

  useEffect(() => {
    if (entries.length === 0) {
      setEntries(generateSeedEntries());
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'dawn' ? 'dusk' : 'dawn'));
  }, [setTheme]);

  const navigateTo = (newScreen: Screen, entry?: JournalEntry) => {
    if (entry) {
        setActiveEntry(entry);
    } else {
        setActiveEntry(null);
    }
    setScreen(newScreen);
  };
  
  const addEntry = (entry: Omit<JournalEntry, 'entry_id' | 'timestamp_iso' | 'tags'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      entry_id: crypto.randomUUID(),
      timestamp_iso: new Date().toISOString(),
      tags: [],
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (updatedEntry: JournalEntry) => {
    setEntries(prev => prev.map(e => e.entry_id === updatedEntry.entry_id ? updatedEntry : e));
    setActiveEntry(updatedEntry);
  };

  const generateTags = async (entry: JournalEntry) => {
    if (!entry.free_text) return;
    try {
      const result = await getTagsAndSummary(entry.free_text);
      const updatedEntry = { ...entry, tags: result.tags, ai_summary: result.summary };
      updateEntry(updatedEntry);
    } catch (error) {
      console.error("Failed to generate tags:", error);
    }
  };

  const generateReframe = async (entry: JournalEntry) => {
    if (!entry.free_text) return;
    try {
      const result = await getReframeAndAction(entry.free_text);
      const updatedEntry = { ...entry, ai_reframe: result.reframe, ai_micro_action: result.micro_action };
      updateEntry(updatedEntry);
    } catch (error) {
      console.error("Failed to generate reframe:", error);
    }
  };


  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen key="home" navigateTo={navigateTo} addEntry={addEntry} entries={entries} />;
      case 'journal':
        return <JournalComposerScreen 
          key="journal" 
          entry={activeEntry} 
          updateEntry={updateEntry}
          generateTags={generateTags}
          generateReframe={generateReframe}
          navigateTo={navigateTo}
        />;
      case 'insights':
        return <InsightsScreen key="insights" entries={entries} />;
      case 'settings':
        return <SettingsScreen key="settings" entries={entries} setEntries={setEntries} />;
      default:
        return <HomeScreen key="home" navigateTo={navigateTo} addEntry={addEntry} entries={entries} />;
    }
  };

  if (isLoading) {
    return (
        <div className={`w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-dawn-bg-start to-dawn-bg-end dark:from-dusk-bg-start dark:to-dusk-bg-end transition-colors duration-500`}>
        </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`w-full min-h-screen font-sans bg-gradient-to-br from-dawn-bg-start to-dawn-bg-end dark:from-dusk-bg-start dark:to-dusk-bg-end text-dawn-text dark:text-dusk-text transition-colors duration-500`}>
        <main className="max-w-lg mx-auto pb-28 px-6">
          <AnimatePresence mode="wait">
              {renderScreen()}
          </AnimatePresence>
        </main>
        <BottomNav activeScreen={screen} setScreen={setScreen} />
      </div>
    </ThemeContext.Provider>
  );
}