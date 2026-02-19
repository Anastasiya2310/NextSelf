import { useEffect, useMemo, useState } from 'react'
import {
  getCurrentMonthInfo,
  getCurrentStreak,
  getMonthlyCompletionStats,
  startOfDay,
  fromISODate,
} from '../utils/dateUtils'
import type { Habit, HabitWithStats } from '../types/habit'

const STORAGE_KEY = 'habit-tracker:v1'

const createHabit = (data: Omit<Habit, 'id' | 'completedDates'>): Habit => ({
  id: crypto.randomUUID(),
  completedDates: [],
  ...data,
})

const loadHabits = (): Habit[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as Habit[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

const saveHabits = (habits: Habit[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  } catch {
    // ignore quota / privacy mode errors
  }
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits())

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  const addHabit = (data: { name: string; color: string; frequency: number }) => {
    setHabits((prev) => [...prev, createHabit(data)])
  }

  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id'>>) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              ...updates,
            }
          : habit,
      ),
    )
  }

  const toggleCompletion = (id: string, isoDate: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit
        const exists = habit.completedDates.includes(isoDate)
        return {
          ...habit,
          completedDates: exists
            ? habit.completedDates.filter((d) => d !== isoDate)
            : [...habit.completedDates, isoDate],
        }
      }),
    )
  }

  const removeHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id))
  }

  const clearHabitCurrentMonth = (id: string) => {
    const { year, monthIndex, daysInMonth } = getCurrentMonthInfo()
    const monthStart = new Date(year, monthIndex, 1)
    const monthEnd = new Date(year, monthIndex, daysInMonth)
    const monthStartTime = startOfDay(monthStart).getTime()
    const monthEndTime = startOfDay(monthEnd).getTime()

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit

        const keptDates = habit.completedDates.filter((iso) => {
          const time = startOfDay(fromISODate(iso)).getTime()
          return time < monthStartTime || time > monthEndTime
        })

        return {
          ...habit,
          completedDates: keptDates,
        }
      }),
    )
  }

  const habitsWithStats: HabitWithStats[] = useMemo(
    () =>
      habits.map((habit) => {
        const currentStreak = getCurrentStreak(habit.completedDates)
        const monthly = getMonthlyCompletionStats(habit.completedDates)
        return {
          ...habit,
          stats: {
            currentStreak,
            monthlyCompletionRate: monthly.monthlyCompletionRate,
            monthlyCompletedCount: monthly.monthlyCompletedCount,
            daysInMonth: monthly.daysInMonth,
          },
        }
      }),
    [habits],
  )

  return {
    habits: habitsWithStats,
    addHabit,
    updateHabit,
    toggleCompletion,
    removeHabit,
    clearHabitCurrentMonth,
  }
}

