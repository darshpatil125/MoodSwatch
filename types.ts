
export type MoodEmoji = '😌' | '🙂' | '😐' | '😟' | '😣' | '🤩' | '🌀';

export interface JournalEntry {
  entry_id: string;
  timestamp_iso: string;
  mood_emoji: MoodEmoji;
  intensity: number;
  free_text?: string;
  ai_summary?: string;
  ai_reframe?: string;
  ai_micro_action?: string;
  tags: string[];
  study_load?: number;
  sleep_hours?: number;
}

export type Theme = 'dawn' | 'dusk';

export interface TagAndSummaryResponse {
  summary: string;
  tags: string[];
}

export interface ReframeAndActionResponse {
    reframe: string;
    micro_action: string;
}

export interface WeeklySummary {
    top_tags: string[];
    mood_average: number;
    wins: string[];
    watchouts: string[];
    gentle_nudge: string;
}
