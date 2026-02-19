export type Habit = {
  id: string
  name: string
  color: string
  /**
   * Target number of completions per week.
   * For a "daily" habit we treat this as 7.
   */
  frequency: number
  /**
   * ISO date strings (YYYY-MM-DD) representing completed days.
   */
  completedDates: string[]
}

export type HabitStats = {
  currentStreak: number
  monthlyCompletionRate: number
  monthlyCompletedCount: number
  daysInMonth: number
}

export type HabitWithStats = Habit & {
  stats: HabitStats
}

