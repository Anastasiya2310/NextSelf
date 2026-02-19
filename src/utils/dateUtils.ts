export type CalendarDay = {
  date: Date
  iso: string
  dayOfMonth: number
  isToday: boolean
  isCurrentMonth: boolean
  isPast: boolean
}

const MS_IN_DAY = 24 * 60 * 60 * 1000

export const toISODate = (date: Date): string => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const fromISODate = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const getTodayISO = (): string => toISODate(new Date())

export const startOfDay = (date: Date): Date => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export const isSameDay = (a: Date, b: Date): boolean =>
  startOfDay(a).getTime() === startOfDay(b).getTime()

export const addDays = (date: Date, amount: number): Date =>
  new Date(date.getTime() + amount * MS_IN_DAY)

export const getCurrentMonthInfo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const monthIndex = now.getMonth()

  const firstOfMonth = new Date(year, monthIndex, 1)
  const lastOfMonth = new Date(year, monthIndex + 1, 0)
  const daysInMonth = lastOfMonth.getDate()

  return {
    year,
    monthIndex,
    daysInMonth,
    firstOfMonth,
    lastOfMonth,
  }
}

export const buildCurrentMonthCalendar = (): CalendarDay[] => {
  const { year, monthIndex, daysInMonth, firstOfMonth } = getCurrentMonthInfo()
  const today = startOfDay(new Date())

  const firstWeekday = firstOfMonth.getDay() // 0 (Sun) - 6 (Sat)

  const days: CalendarDay[] = []

  // Leading empty days from previous month for grid alignment
  for (let i = 0; i < firstWeekday; i++) {
    const date = new Date(year, monthIndex, i - firstWeekday + 1)
    const dayStart = startOfDay(date)
    days.push({
      date: dayStart,
      iso: toISODate(dayStart),
      dayOfMonth: dayStart.getDate(),
      isToday: isSameDay(dayStart, today),
      isCurrentMonth: false,
      isPast: dayStart <= today,
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day)
    const dayStart = startOfDay(date)
    days.push({
      date: dayStart,
      iso: toISODate(dayStart),
      dayOfMonth: day,
      isToday: isSameDay(dayStart, today),
      isCurrentMonth: true,
      isPast: dayStart <= today,
    })
  }

  return days
}

export const getCurrentStreak = (completedDates: string[]): number => {
  if (!completedDates.length) return 0

  const completedSet = new Set(completedDates)
  const today = startOfDay(new Date())
  const todayISO = toISODate(today)

  // If today is completed, streak is consecutive days ending today.
  // Otherwise, streak is consecutive days ending yesterday (if any).
  const hasToday = completedSet.has(todayISO)
  let anchor = hasToday ? today : addDays(today, -1)

  // If we don't even have yesterday when today isn't done, no streak.
  if (!hasToday && !completedSet.has(toISODate(anchor))) {
    return 0
  }

  let streak = 0

  while (completedSet.has(toISODate(anchor))) {
    streak += 1
    anchor = addDays(anchor, -1)
  }

  return streak
}

export const getMonthlyCompletionStats = (completedDates: string[]) => {
  const { year, monthIndex, daysInMonth } = getCurrentMonthInfo()
  const monthStart = new Date(year, monthIndex, 1)
  const monthEnd = new Date(year, monthIndex, daysInMonth)

  const monthStartTime = startOfDay(monthStart).getTime()
  const monthEndTime = startOfDay(monthEnd).getTime()

  const uniqueCompletedThisMonth = new Set(
    completedDates.filter((iso) => {
      const time = startOfDay(fromISODate(iso)).getTime()
      return time >= monthStartTime && time <= monthEndTime
    }),
  )

  const monthlyCompletedCount = uniqueCompletedThisMonth.size
  const monthlyCompletionRate =
    daysInMonth === 0 ? 0 : (monthlyCompletedCount / daysInMonth) * 100

  return {
    monthlyCompletedCount,
    monthlyCompletionRate,
    daysInMonth,
  }
}

export const getStartOfWeek = (date: Date, weekStartsOn = 1): Date => {
  // weekStartsOn: 0 = Sunday, 1 = Monday
  const day = date.getDay()
  const diff = (day < weekStartsOn
    ? 7 - (weekStartsOn - day)
    : day - weekStartsOn)

  return startOfDay(addDays(date, -diff))
}

export const getEndOfWeek = (date: Date, weekStartsOn = 1): Date => {
  const start = getStartOfWeek(date, weekStartsOn)
  return startOfDay(addDays(start, 6))
}

export const getWeeklyCompletionCount = (completedDates: string[]) => {
  if (!completedDates.length) return 0

  const today = startOfDay(new Date())
  const weekStart = getStartOfWeek(today, 1)
  const weekEnd = getEndOfWeek(today, 1)

  const startTime = weekStart.getTime()
  const endTime = weekEnd.getTime()

  const uniqueCompletedThisWeek = new Set(
    completedDates.filter((iso) => {
      const time = startOfDay(fromISODate(iso)).getTime()
      return time >= startTime && time <= endTime
    }),
  )

  return uniqueCompletedThisWeek.size
}

