/// <reference types="vitest" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HabitForm } from '../../src/components/HabitForm'

describe('HabitForm', () => {
  it('disables submit when name is empty and enables when filled', async () => {
    const user = userEvent.setup()
    const handleCreate = vi.fn()

    render(<HabitForm onCreate={handleCreate} />)

    const submitButton = screen.getByRole('button', { name: /add habit/i })
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText(/name/i), ' Morning walk ')

    expect(submitButton).toBeEnabled()
  })

  it('submits a daily habit with trimmed name and default color', async () => {
    const user = userEvent.setup()
    const handleCreate = vi.fn()

    render(<HabitForm onCreate={handleCreate} />)

    await user.type(screen.getByLabelText(/name/i), '  Read book  ')
    await user.click(screen.getByRole('button', { name: /add habit/i }))

    expect(handleCreate).toHaveBeenCalledTimes(1)
    expect(handleCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Read book',
        frequency: 7,
      }),
    )

    // After submit, the name field should be cleared
    expect(screen.getByLabelText(/name/i)).toHaveValue('')
  })

})

