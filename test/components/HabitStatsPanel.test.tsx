/// <reference types="vitest" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import React from 'react'
import { render, screen } from '@testing-library/react'
import { HabitStatsPanel } from '../../src/components/HabitStatsPanel'
import type { HabitWithStats } from '../../src/types/habit'

vi.mock('../../src/utils/dateUtils', () => ({
  getWeeklyCompletionCount: () => 3,
}))

const makeHabit = (overrides: Partial<HabitWithStats> = {}): HabitWithStats => ({
  id: 'habit-1',
  name: 'Test habit',
  color: '#00ff00',
  frequency: 7,
  completedDates: [],
  stats: {
    currentStreak: 5,
    monthlyCompletionRate: 80,
    monthlyCompletedCount: 24,
    daysInMonth: 30,
  },
  ...overrides,
})

describe('HabitStatsPanel', () => {
  it('renders basic stats information', () => {
    const habit = makeHabit()

    render(<HabitStatsPanel habit={habit} />)

    expect(screen.getByText(/stats/i)).toBeInTheDocument()
    expect(screen.getByText(/current streak/i)).toBeInTheDocument()
    // There are multiple "This month" texts; check the label specifically
    const monthLabels = screen.getAllByText(/this month/i)
    expect(monthLabels.length).toBeGreaterThan(0)
    expect(screen.getByText(/target/i)).toBeInTheDocument()
    expect(screen.getByText(/test habit/i)).toBeInTheDocument()
  })

  it('shows daily goal messaging when frequency is 7', () => {
    const habit = makeHabit({
      stats: {
        currentStreak: 5,
        monthlyCompletionRate: 100,
        monthlyCompletedCount: 30,
        daysInMonth: 30,
      },
    })

    render(<HabitStatsPanel habit={habit} />)

    expect(
      screen.getByText(/daily goal completed for this month/i),
    ).toBeInTheDocument()
  })

  it('shows weekly goal messaging when frequency is less than 7', () => {
    const habit = makeHabit({
      frequency: 3,
    })

    render(<HabitStatsPanel habit={habit} />)

    expect(screen.getByText(/per week/i)).toBeInTheDocument()
    expect(
      screen.getByText(/weekly goal completed\./i),
    ).toBeInTheDocument()
  })
})

