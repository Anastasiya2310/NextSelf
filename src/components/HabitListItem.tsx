import { memo, useMemo } from 'react'
import type { HabitWithStats } from '../types/habit'
import { addDays, getCurrentMonthInfo, startOfDay } from '../utils/dateUtils'
import { getContrastingTextColor } from '../utils/colorUtils'

type HabitListItemProps = {
  habit: HabitWithStats
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

export const HabitListItem = memo(function HabitListItem({
  habit,
  isActive,
  onSelect,
  onDelete,
}: HabitListItemProps) {
  const frequencyLabel = useMemo(() => {
    if (habit.frequency === 7) return 'Daily'
    return `${habit.frequency}× / week`
  }, [habit.frequency])

  // const completionLabel = useMemo(() => {
  //   const pct = Math.round(habit.stats.monthlyCompletionRate)
  //   return `${pct}% this month`
  // }, [habit.stats.monthlyCompletionRate])

  const isOnTrackThisMonth = useMemo(() => {
    if (habit.stats.daysInMonth === 0 || habit.stats.monthlyCompletedCount === 0) {
      return false
    }

    const { firstOfMonth } = getCurrentMonthInfo()
    const today = startOfDay(new Date())

    let elapsedDays = 0
    let cursor = startOfDay(firstOfMonth)

    while (cursor <= today && elapsedDays < habit.stats.daysInMonth) {
      elapsedDays += 1
      cursor = addDays(cursor, 1)
    }

    const expectedCompletionsSoFar = (habit.frequency / 7) * elapsedDays

    return habit.stats.monthlyCompletedCount >= expectedCompletionsSoFar
  }, [habit.frequency, habit.stats.daysInMonth, habit.stats.monthlyCompletedCount])

  const textColor = useMemo(
    () => getContrastingTextColor(habit.color),
    [habit.color],
  )

  return (
    <li>
      <button
        type="button"
        className={`habit-list-item ${isActive ? 'habit-list-item--active' : ''} ${
          isOnTrackThisMonth ? 'habit-list-item--on-track' : ''
        }`}
        style={{
          backgroundColor: habit.color,
          borderColor: habit.color,
          color: textColor,
        }}
        onClick={onSelect}
      >
        <div className="habit-list-item-main">
          <div>
            <div className="habit-name">{habit.name}</div>
            <div className="habit-meta">
              <span
                className={
                  isOnTrackThisMonth ? 'habit-meta-frequency habit-meta-frequency--on-track' : 'habit-meta-frequency'
                }
              >
                {frequencyLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="habit-list-item-stats">
          <span className="stat-pill">
            🔥 {habit.stats.currentStreak}
            <span className="stat-pill-label">day streak</span>
          </span>
          <button
            type="button"
            className="icon-button icon-button--danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            aria-label={`Delete habit ${habit.name}`}
          >
            ×
          </button>
        </div>
      </button>
    </li>
  )
})

