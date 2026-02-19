/// <reference types="vitest" />

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HabitCalendar } from '../../src/components/HabitCalendar'
import type { HabitWithStats } from '../../src/types/habit'

vi.mock('../../src/utils/dateUtils', () => ({
  getCurrentMonthInfo: () => ({
    year: 2025,
    monthIndex: 0,
    daysInMonth: 31,
    firstOfMonth: new Date(2025, 0, 1),
  }),
  buildCurrentMonthCalendar: () => [
    {
      iso: '2025-01-01',
      dayOfMonth: 1,
      isToday: false,
      isPast: true,
      isCurrentMonth: true,
    },
    {
      iso: '2025-01-02',
      dayOfMonth: 2,
      isToday: true,
      isPast: true,
      isCurrentMonth: true,
    },
  ],
}))

const habit: HabitWithStats = {
  id: 'habit-1',
  name: 'Test habit',
  color: '#ff0000',
  frequency: 7,
  completedDates: ['2025-01-02'],
  stats: {
    currentStreak: 1,
    monthlyCompletionRate: 50,
    monthlyCompletedCount: 1,
    daysInMonth: 2,
  },
}

describe('HabitCalendar', () => {
  it('renders calendar header and legend', () => {
    render(
      <HabitCalendar
        habit={habit}
        onToggleDate={() => {}}
        onClearMonth={() => {}}
      />,
    )

    expect(screen.getByText(/calendar/i)).toBeInTheDocument()
    expect(screen.getByText(/clear month/i)).toBeInTheDocument()
  })

  it('calls onToggleDate when a day is clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()

    render(
      <HabitCalendar
        habit={habit}
        onToggleDate={handleToggle}
        onClearMonth={() => {}}
      />,
    )

    const dayButton = screen.getByRole('button', { name: /1/ })
    await user.click(dayButton)

    expect(handleToggle).toHaveBeenCalledWith('2025-01-01')
  })

  it('calls onClearMonth when the clear button is clicked', async () => {
    const user = userEvent.setup()
    const handleClear = vi.fn()

    render(
      <HabitCalendar
        habit={habit}
        onToggleDate={() => {}}
        onClearMonth={handleClear}
      />,
    )

    await user.click(screen.getByRole('button', { name: /clear month/i }))

    expect(handleClear).toHaveBeenCalledTimes(1)
  })
})

