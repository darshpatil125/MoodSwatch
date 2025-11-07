import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className={`bg-dawn-card dark:bg-dusk-card backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 shadow-soft dark:shadow-soft-dark ${className}`}
      whileHover={onClick ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;