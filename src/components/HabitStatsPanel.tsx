import { memo, useMemo } from 'react'
import type { Habit, HabitWithStats } from '../types/habit'
import { getWeeklyCompletionCount } from '../utils/dateUtils'

type HabitStatsPanelProps = {
  habit: HabitWithStats
  // onUpdate: (updates: Partial<Omit<Habit, 'id'>>) => void
}

export const HabitStatsPanel = memo(function HabitStatsPanel({
  habit
  // onUpdate,
}: HabitStatsPanelProps) {
  const pctRounded = useMemo(() => {
    const raw = Math.round(habit.stats.monthlyCompletionRate)
    return Math.max(0, Math.min(raw, 100))
  }, [habit.stats.monthlyCompletionRate])

  const frequencyLabel = useMemo(() => {
    if (habit.frequency === 7) return 'Daily'
    return `${habit.frequency}× per week`
  }, [habit.frequency])

  const isGoalMet = useMemo(() => {
    // DAILY mode (7x per week)
    if (habit.frequency === 7) {
      return (
        habit.stats.monthlyCompletedCount >=
        habit.stats.daysInMonth
      )
    }
  
    // WEEKLY mode
    const weeklyCount = getWeeklyCompletionCount(
      habit.completedDates
    )
  
    return weeklyCount >= habit.frequency
  }, [
    habit.frequency,
    habit.stats.monthlyCompletedCount,
    habit.stats.daysInMonth,
    habit.completedDates,
  ])

  return (
    <section className="panel stats-panel">
      <header className="panel-header">
        <div>
          <h2 className="panel-title">Stats</h2>
          <p className="muted">
            Tracking <span className="habit-name-inline">{habit.name}</span>
          </p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Current streak</span>
          <div className="stat-value">
            {habit.stats.currentStreak}
            <span className="stat-unit">days</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">This month</span>
          <div className="stat-value">
            {pctRounded}
            <span className="stat-unit">%</span>
          </div>
          <div className="stat-sub">
            {habit.stats.monthlyCompletedCount} / {habit.stats.daysInMonth} days completed
          </div>
          <div className="stat-progress">
            <div className="stat-progress-track">
              <div
                className="stat-progress-fill"
                style={{
                  width: `${pctRounded}%`,
                  background: `linear-gradient(135deg, ${habit.color}, #4f46e5)`,
                }}
              />
            </div>
          </div>
        </div>

        <div className={`stat-card ${isGoalMet ? 'stat-card--goal-met' : ''}`}>
          <span className="stat-label">Target</span>
          <div className="stat-value">
            {frequencyLabel}
            <span className="stat-unit">goal</span>
          </div>
          <div className="stat-sub">
            {habit.frequency === 7
              ? isGoalMet
                ? 'Daily goal completed for this month.'
                : 'Keep going to complete all days this month.'
              : isGoalMet
                ? 'Weekly goal completed.'
                : 'Keep going to hit this week\'s goal.'}
          </div>
        </div>
      </div>
    </section>
  )
})

