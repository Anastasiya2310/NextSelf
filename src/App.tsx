import './App.scss'
import { HabitList } from './components/HabitList'
import { HabitForm } from './components/HabitForm'
import { HabitCalendar } from './components/HabitCalendar'
import { HabitStatsPanel } from './components/HabitStatsPanel'
import { useHabits } from './hooks/useHabits'
import type { HabitWithStats } from './types/habit'
import { useMemo, useState } from 'react'

function App() {
  const {
    habits,
    addHabit,
    toggleCompletion,
    removeHabit,
    clearHabitCurrentMonth,
  } = useHabits()
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)

  // Derive effective selected habit ID: use user's selection if valid, otherwise auto-select first
  const effectiveSelectedHabitId = useMemo(() => {
    if (habits.length === 0) return null
    const stillExists = habits.some((h) => h.id === selectedHabitId)
    return stillExists ? selectedHabitId : habits[0]?.id ?? null
  }, [habits, selectedHabitId])

  const selectedHabit: HabitWithStats | undefined =
    habits.find((h) => h.id === effectiveSelectedHabitId) ?? habits[0]

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1 className="app-title">
            <img
              src="/logo.png"
              alt="NextSelf logo"
              className="app-logo"
            />
            <p className="app-subtitle">
              Build better routines with a simple, focused tracker.
            </p>
          </h1>
        </div>
      </header>

      <main className="app-layout">
        <section className="sidebar">
          <HabitForm onCreate={addHabit} />
          <HabitList
            habits={habits}
            selectedHabitId={effectiveSelectedHabitId}
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
