import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { JournalEntry } from '../../types';
import { ThemeContext } from '../../App';
import { SunIcon, MoonIcon } from '../icons/Icons';

interface SettingsScreenProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ entries, setEntries }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const exportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(entries, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `mood-journal-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };
  
  const clearData = () => {
    if(window.confirm("are you sure you want to delete all your entries? this cannot be undone.")) {
        setEntries([]);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">settings</h1>
        <p className="mt-2 opacity-70">customize your space</p>
      </header>

      <div className="mt-10 space-y-6">
        <GlassCard className="p-5">
          <h2 className="font-semibold mb-3">theme</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-80">switch between dawn and dusk mode</p>
            <button onClick={toggleTheme} className="p-2 rounded-full bg-white/50 dark:bg-black/20">
              {theme === 'dawn' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
            <h2 className="font-semibold mb-3">data management</h2>
            <div className="space-y-3">
                 <button onClick={exportData} className="w-full py-3 text-center rounded-xl bg-white/60 dark:bg-black/20 font-semibold">
                    export all entries as json
                </button>
                <button onClick={clearData} className="w-full py-3 text-center rounded-xl bg-red-500/20 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-semibold">
                    delete all data
                </button>
            </div>
             <p className="text-xs opacity-60 mt-4">all your data is stored securely on your device. it is never sent to a server.</p>
        </GlassCard>
        
        <GlassCard className="p-5 bg-orange-400/10 border border-orange-500/20">
            <h2 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">gentle reminder</h2>
            <p className="text-sm text-orange-800/80 dark:text-orange-300/80 leading-relaxed">
                this is a journaling aid, not medical advice. if you’re struggling, please consider reaching out to a trusted adult or a mental health professional for support.
            </p>
        </GlassCard>

      </div>
    </motion.div>
  );
};

export default SettingsScreen;