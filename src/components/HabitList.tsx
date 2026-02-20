import { memo } from 'react'
import type { HabitWithStats } from '../types/habit'
import { HabitListItem } from './HabitListItem.tsx'

type HabitListProps = {
  habits: HabitWithStats[]
  selectedHabitId: string | null
  onSelectHabit: (id: string) => void
  onDeleteHabit: (id: string) => void
}

export const HabitList = memo(function HabitList({
  habits,
  selectedHabitId,
  onSelectHabit,
  onDeleteHabit,
}: HabitListProps) {
  return (
    <section className="panel habit-list">
      <div className="panel-header">
        <h2 className="panel-title">Your habits</h2>
        <span className="badge">{habits.length}</span>
      </div>

      {habits.length === 0 ? (
        <p className="muted">No habits yet. Create your first one above.</p>
      ) : (
        <ul className="habit-list-items">
          {habits.map((habit) => (
            <HabitListItem
              key={habit.id}
              habit={habit}
              isActive={habit.id === selectedHabitId}
              onSelect={() => onSelectHabit(habit.id)}
              onDelete={() => onDeleteHabit(habit.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
})