import { memo, useMemo } from 'react'
import type { HabitWithStats } from '../types/habit'
import { buildCurrentMonthCalendar, getCurrentMonthInfo } from '../utils/dateUtils'
import { getContrastingTextColor } from '../utils/colorUtils'

type HabitCalendarProps = {
  habit: HabitWithStats
  onToggleDate: (isoDate: string) => void
  onClearMonth: () => void
}

export const HabitCalendar = memo(function HabitCalendar({
  habit,
  onToggleDate,
  onClearMonth,
}: HabitCalendarProps) {
  const monthInfo = useMemo(() => getCurrentMonthInfo(), [])
  const calendarDays = useMemo(() => buildCurrentMonthCalendar(), [])

  const completedSet = useMemo(
    () => new Set(habit.completedDates),
    [habit.completedDates],
  )

  const monthLabel = useMemo(() => {
    const date = new Date(monthInfo.year, monthInfo.monthIndex, 1)
    return date.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    })
  }, [monthInfo.year, monthInfo.monthIndex])

  return (
    <section className="panel calendar-panel">
      <header className="panel-header">
        <div>
          <h2 className="panel-title">Calendar</h2>
          <p className="muted">{monthLabel}</p>
        </div>
        <div className="calendar-legend">
          <span className="legend-item">
            <span className="legend-dot legend-dot--completed" /> Completed
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot--today" /> Today
          </span>
          <button
            type="button"
            className="chip-button chip-button--ghost"
            onClick={onClearMonth}
          >
            Clear month
          </button>
        </div>
      </header>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dow) => (
          <div key={dow} className="calendar-grid-header">
            {dow}
          </div>
        ))}

        {calendarDays.map((day) => {
          const isCompleted = completedSet.has(day.iso)
          const isDisabled = !day.isPast || !day.isCurrentMonth

          const style: React.CSSProperties = isCompleted
            ? {
                backgroundColor: habit.color,
                borderColor: habit.color,
                color: getContrastingTextColor(habit.color),
              }
            : {}

          return (
            <button
              key={day.iso + (day.isCurrentMonth ? 'current' : 'other')}
              type="button"
              className={[
                'calendar-day',
                !day.isCurrentMonth && 'calendar-day--other-month',
                day.isToday && 'calendar-day--today',
                isCompleted && 'calendar-day--completed',
              ]
                .filter(Boolean)
                .join(' ')}
              style={style}
              disabled={isDisabled}
              onClick={() => onToggleDate(day.iso)}
            >
              <span>{day.dayOfMonth}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
})