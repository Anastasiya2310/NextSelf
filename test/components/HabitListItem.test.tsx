/// <reference types="vitest" />

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HabitListItem } from '../../src/components/HabitListItem'
import type { HabitWithStats } from '../../src/types/habit'

const baseHabit: HabitWithStats = {
  id: 'habit-1',
  name: 'Test habit',
  color: '#000000',
  frequency: 7,
  completedDates: [],
  stats: {
    currentStreak: 3,
    monthlyCompletionRate: 50,
    monthlyCompletedCount: 15,
    daysInMonth: 30,
  },
}

describe('HabitListItem', () => {
  it('renders habit name and streak', () => {
    render(
      <HabitListItem
        habit={baseHabit}
        isActive={false}
        onSelect={() => {}}
        onDelete={() => {}}
      />,
    )

    expect(screen.getByText(/test habit/i)).toBeInTheDocument()
    expect(screen.getByText(/3/)).toBeInTheDocument()
  })

  it('calls onSelect when the item is clicked', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()

    render(
      <HabitListItem
        habit={baseHabit}
        isActive={false}
        onSelect={handleSelect}
        onDelete={() => {}}
      />,
    )

    // Click the main habit button (not the delete button)
    const mainButton = screen
      .getAllByRole('button')
      .find((btn) => btn.classList.contains('habit-list-item'))

    expect(mainButton).toBeDefined()
    await user.click(mainButton as HTMLButtonElement)
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onDelete without triggering onSelect when delete button is clicked', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    const handleDelete = vi.fn()

    render(
      <HabitListItem
        habit={baseHabit}
        isActive={false}
        onSelect={handleSelect}
        onDelete={handleDelete}
      />,
    )

    const deleteButton = screen.getByRole('button', {
      name: /delete habit test habit/i,
    })

    await user.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledTimes(1)
    expect(handleSelect).not.toHaveBeenCalled()
  })
})

