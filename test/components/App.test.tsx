/// <reference types="vitest" />

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App'
import type { HabitWithStats } from '../../src/types/habit'

vi.mock('../../src/hooks/useHabits', () => {
  const habits: HabitWithStats[] = [
    {
      id: 'habit-1',
      name: 'First',
      color: '#123456',
      frequency: 7,
      completedDates: [],
      stats: {
        currentStreak: 1,
        monthlyCompletionRate: 50,
        monthlyCompletedCount: 1,
        daysInMonth: 30,
      },
    },
    {
      id: 'habit-2',
      name: 'Second',
      color: '#654321',
      frequency: 7,
      completedDates: [],
      stats: {
        currentStreak: 2,
        monthlyCompletionRate: 60,
        monthlyCompletedCount: 2,
        daysInMonth: 30,
      },
    },
  ]

  return {
    useHabits: () => ({
      habits,
      addHabit: vi.fn(),
      toggleCompletion: vi.fn(),
      removeHabit: vi.fn(),
      clearHabitCurrentMonth: vi.fn(),
    }),
  }
})

describe('App', () => {
  it('renders header and main layout', () => {
    render(<App />)

    expect(
      screen.getByText(/build better routines/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/your habits/i)).toBeInTheDocument()
    expect(screen.getByText(/calendar/i)).toBeInTheDocument()
    expect(screen.getByText(/stats/i)).toBeInTheDocument()
  })

  it('allows selecting a habit from the list', async () => {
    const user = userEvent.setup()

    render(<App />)

    const secondHabit = screen.getByText('Second')
    await user.click(secondHabit)

    expect(screen.getByText(/tracking/i)).toHaveTextContent('Second')
  })
})

