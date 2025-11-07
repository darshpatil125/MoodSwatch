import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JournalEntry, WeeklySummary } from '../../types';
import GlassCard from '../ui/GlassCard';
import { getWeeklySummary } from '../../services/geminiService';
import Loader from '../ui/Loader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MOOD_COLORS = {
  '🤩': '#FFB74D', '🙂': '#81C784', '😌': '#64B5F6', '😐': '#FFD54F', '😟': '#E57373', '😣': '#F06292', '🌀': '#BA68C8'
};

const InsightsScreen: React.FC<{ entries: JournalEntry[] }> = ({ entries }) => {
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const last7DaysEntries = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return entries.filter(entry => new Date(entry.timestamp_iso) > sevenDaysAgo);
  }, [entries]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (last7DaysEntries.length > 0) {
        try {
          setIsLoading(true);
          const result = await getWeeklySummary(last7DaysEntries);
          setSummary(result);
        } catch (error) {
          console.error("Failed to fetch weekly summary:", error);
          setSummary(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);
  
  const moodDistribution = useMemo(() => {
    const counts = last7DaysEntries.reduce((acc, entry) => {
      acc[entry.mood_emoji] = (acc[entry.mood_emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [last7DaysEntries]);

  const weeklyMoodAverage = useMemo(() => {
    const dataByDay: { [key: string]: { total: number; count: number } } = {};
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    for(let i=6; i>=0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayName = daysOfWeek[d.getDay()];
        if (!dataByDay[dayName]) dataByDay[dayName] = { total: 0, count: 0 };
    }

    last7DaysEntries.forEach(entry => {
      // FIX: Corrected typo from `toLocaleDate'string'` to `toLocaleDateString`
      const day = new Date(entry.timestamp_iso).toLocaleDateString('en-US', { weekday: 'short' });
      dataByDay[day].total += entry.intensity;
      dataByDay[day].count += 1;
    });

    return Object.entries(dataByDay).map(([name, { total, count }]) => ({
      name,
      average: count > 0 ? total / count : 0,
    }));
  }, [last7DaysEntries]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">your weekly vibe</h1>
        <p className="mt-2 opacity-70">reflect on your patterns & wins</p>
      </header>

      {last7DaysEntries.length === 0 ? (
         <GlassCard className="mt-10 p-8 text-center">
            <p className="font-semibold">not enough data for insights yet.</p>
            <p className="text-sm opacity-70 mt-1">keep journaling to see your trends bloom.</p>
        </GlassCard>
      ) : (
      <>
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Loader /></div>
        ) : summary && (
          <GlassCard className="mt-10 p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-dawn-accent dark:text-dusk-accent text-sm">Top Tags</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {summary.top_tags.map(tag => <span key={tag} className="px-3 py-1 bg-dawn-accent/10 dark:bg-dusk-accent/10 text-sm rounded-full font-medium">{tag}</span>)}
              </div>
            </div>
             <div>
              <h3 className="font-semibold text-dawn-accent dark:text-dusk-accent text-sm">Wins ✨</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm opacity-90">
                {summary.wins.map(win => <li key={win}>{win}</li>)}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-dawn-accent dark:text-dusk-accent text-sm">Watchouts 🧐</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm opacity-90">
                {summary.watchouts.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-dawn-accent dark:text-dusk-accent text-sm">Gentle Nudge</h3>
              <p className="italic mt-2 text-sm opacity-90">"{summary.gentle_nudge}"</p>
            </div>
          </GlassCard>
        )}

        <GlassCard className="mt-6 p-6">
          <h2 className="font-bold text-lg mb-4">mood bloom</h2>
          <div className="w-full h-48">
             <ResponsiveContainer>
                <PieChart>
                  <Pie data={moodDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={(props) => props.name}>
                     {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name as keyof typeof MOOD_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '1rem' }}/>
                </PieChart>
              </ResponsiveContainer>
          </div>
        </GlassCard>
        
        <GlassCard className="mt-6 p-6">
          <h2 className="font-bold text-lg mb-4">weekly average</h2>
          <div className="w-full h-48">
            <ResponsiveContainer>
              <BarChart data={weeklyMoodAverage} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '1rem' }} cursor={{fill: 'rgba(128,128,128,0.1)'}}/>
                <Bar dataKey="average" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-dawn-text/80 dark:fill-dusk-text/80"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </>
      )}
    </motion.div>
  );
};

export default InsightsScreen;