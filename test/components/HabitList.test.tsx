/// <reference types="vitest" />

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HabitList } from '../../src/components/HabitList'
import type { HabitWithStats } from '../../src/types/habit'

const makeHabit = (overrides: Partial<HabitWithStats> = {}): HabitWithStats => ({
  id: '1',
  name: 'Test habit',
  color: '#ffffff',
  frequency: 7,
  completedDates: [],
  stats: {
    currentStreak: 0,
    monthlyCompletionRate: 0,
    monthlyCompletedCount: 0,
    daysInMonth: 30,
  },
  ...overrides,
})

describe('HabitList', () => {
  it('renders empty state when there are no habits', () => {
    render(
      <HabitList
        habits={[]}
        selectedHabitId={null}
        onSelectHabit={() => {}}
        onDeleteHabit={() => {}}
      />,
    )

    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument()
    expect(screen.getByText(/0/i)).toBeInTheDocument()
  })

  it('renders list items and wires selection and delete callbacks', async () => {
    const user = userEvent.setup()
    const onSelectHabit = vi.fn()
    const onDeleteHabit = vi.fn()

    const habits = [
      makeHabit({ id: '1', name: 'Habit 1' }),
      makeHabit({ id: '2', name: 'Habit 2' }),
    ]

    render(
      <HabitList
        habits={habits}
        selectedHabitId={'1'}
        onSelectHabit={onSelectHabit}
        onDeleteHabit={onDeleteHabit}
      />,
    )

    expect(screen.getByText('Habit 1')).toBeInTheDocument()
    expect(screen.getByText('Habit 2')).toBeInTheDocument()

    await user.click(screen.getByText('Habit 2'))
    expect(onSelectHabit).toHaveBeenCalledWith('2')

    const deleteButton = screen.getByRole('button', { name: /delete habit habit 1/i })
    await user.click(deleteButton)
    expect(onDeleteHabit).toHaveBeenCalledWith('1')
  })
})

