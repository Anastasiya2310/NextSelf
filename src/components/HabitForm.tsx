import { useState } from 'react'

type HabitFormProps = {
  onCreate: (data: { name: string; color: string; frequency: number }) => void
}

type FrequencyMode = 'daily' | 'custom'

export const HabitForm = ({ onCreate }: HabitFormProps) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>('#6366f1')
  const [frequencyMode, setFrequencyMode] = useState<FrequencyMode>('daily')
  const [customTimes, setCustomTimes] = useState(3)

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    const frequency = frequencyMode === 'daily' ? 7 : Math.min(Math.max(customTimes, 1), 7)

    onCreate({
      name: trimmedName,
      color,
      frequency,
    })

    setName('')
  }

  return (
    <form className="panel habit-form" onSubmit={handleSubmit}>
      <h2 className="panel-title">Create habit</h2>
      <div className="field-group">
        <label className="field-label" htmlFor="habit-name">
          Name
        </label>
        <input
          id="habit-name"
          type="text"
          className="field-input"
          placeholder="e.g. Morning walk"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label" htmlFor="habit-color">
            Color
          </label>
          <div className="color-input-wrapper">
            <input
              id="habit-color"
              type="color"
              className="color-input"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Frequency</label>
          <div className="frequency-row">
            <select
              className="field-input"
              value={frequencyMode}
              onChange={(e) => setFrequencyMode(e.target.value as FrequencyMode)}
            >
              <option value="daily">Daily</option>
              <option value="custom">Times per week</option>
            </select>
            {frequencyMode === 'custom' && (
              <input
                type="number"
                className="field-input frequency-number"
                min={1}
                max={7}
                value={customTimes}
                onChange={(e) => setCustomTimes(Number(e.target.value) || 1)}
              />
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="primary-button" disabled={!name.trim()}>
        Add habit
      </button>
    </form>
  )
}