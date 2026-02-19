import './App.css'
import { HabitList } from './components/HabitList'
import { HabitForm } from './components/HabitForm'
import { HabitCalendar } from './components/HabitCalendar'
import { HabitStatsPanel } from './components/HabitStatsPanel'
import { useHabits } from './hooks/useHabits'
import type { HabitWithStats } from './types/habit'
import { useEffect, useState } from 'react'

function App() {
  const {
    habits,
    addHabit,
    toggleCompletion,
    removeHabit,
    clearHabitCurrentMonth,
  } = useHabits()
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)

  // Keep selection in sync with habit list
  useEffect(() => {
    if (habits.length === 0) {
      setSelectedHabitId(null)
      return
    }

    const stillExists = habits.some((h) => h.id === selectedHabitId)
    if (!stillExists) {
      setSelectedHabitId(habits[0]?.id ?? null)
    }
  }, [habits, selectedHabitId])

  const selectedHabit: HabitWithStats | undefined =
    habits.find((h) => h.id === selectedHabitId) ?? habits[0]

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1 className="app-title">Habit Tracker</h1>
          <p className="app-subtitle">
            Build better routines with a simple, focused tracker.
          </p>
        </div>
      </header>

      <main className="app-layout">
        <section className="sidebar">
          <HabitForm onCreate={addHabit} />
          <HabitList
            habits={habits}
            selectedHabitId={selectedHabit?.id ?? null}
            onSelectHabit={setSelectedHabitId}
            onDeleteHabit={removeHabit}
          />
        </section>

        <section className="content">
          {selectedHabit ? (
            <>
              <HabitCalendar
                habit={selectedHabit}
                onToggleDate={(isoDate) =>
                  toggleCompletion(selectedHabit.id, isoDate)
                }
                onClearMonth={() => clearHabitCurrentMonth(selectedHabit.id)}
              />
              <HabitStatsPanel
                habit={selectedHabit}
              />
            </>
          ) : (
            <div className="empty-state">
              <h2>No habits yet</h2>
              <p>Start by creating your first habit on the left.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
