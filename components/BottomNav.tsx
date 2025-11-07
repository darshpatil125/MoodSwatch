import React from 'react';
import { HomeIcon, BarChart3Icon, SettingsIcon, PlusIcon } from './icons/Icons';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeScreen: string;
  setScreen: (screen: 'home' | 'journal' | 'insights' | 'settings') => void;
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full text-xs transition-colors duration-300 focus:outline-none" aria-label={label}>
    <div className="relative flex flex-col items-center">
      {icon}
      <span className={`mt-1.5 ${isActive ? 'text-dawn-text dark:text-dusk-text font-semibold' : 'text-gray-400 dark:text-gray-500'}`}>{label}</span>
      {isActive && (
        <motion.div
          layoutId="active-nav-indicator"
          className="absolute -bottom-1 w-1.5 h-1.5 bg-dawn-accent dark:bg-dusk-accent rounded-full"
        />
      )}
    </div>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setScreen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] max-w-lg mx-auto bg-dawn-card/80 dark:bg-dusk-card/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5">
      <div className="grid grid-cols-4 items-center justify-around h-full">
        <NavItem icon={<HomeIcon active={activeScreen === 'home'} />} label="Home" isActive={activeScreen === 'home'} onClick={() => setScreen('home')} />
        <NavItem icon={<BarChart3Icon active={activeScreen === 'insights'} />} label="Insights" isActive={activeScreen === 'insights'} onClick={() => setScreen('insights')} />
        <div className="flex items-center justify-center">
             <button 
              onClick={() => setScreen('journal')}
              aria-label="New Journal Entry"
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-dawn-accent to-red-400 dark:from-dusk-accent dark:to-pink-400 rounded-full text-white shadow-lg shadow-red-200/50 dark:shadow-pink-900/50 transform hover:scale-105 transition-transform duration-300"
            >
              <PlusIcon />
            </button>
        </div>
        <NavItem icon={<SettingsIcon active={activeScreen === 'settings'} />} label="Settings" isActive={activeScreen === 'settings'} onClick={() => setScreen('settings')} />
      </div>
    </nav>
  );
};

export default BottomNav;