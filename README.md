# NextSelf

A focused habit tracker that helps you build consistency and measure real progress.
NextSelf allows users to create customizable habits, track streaks, and monitor monthly performance with clear statistics.

## Screenshots
![Home Screen](public/screenshots/desktop.png)

## Features

### Habit Management
- Create habits with a custom name
- Assign a color to each habit
- Set frequency:
  - Daily
  - Specific number of times per week

### Progress Tracking
- Current streak (consecutive days completed)
- Monthly completion rate (in %)
- Weekly and monthly target achievement status
- Total days completed

### Visual Feedback
- Color-coded habits
- Clear success/failure indicators for targets

## How It Works

- Daily habits require completion every day to maintain streak.
- Weekly habits require hitting the defined number of completions per week.
- Monthly completion percentage is calculated as:
  completed_days / total_possible_days * 100
- Target status shows whether the user met their defined frequency.

## Tech Stack

Frontend:
- React
- TypeScript
- Vite

### Development Tools
- ESLint (for code quality and linting)

## Installation

1. Clone repository
   git clone https://github.com/Anastasiya2310/nextself.git

2. Install dependencies
   npm install

3. Start development server
   npm run dev

## Project Structure

src/
  assets/
  components/
  hooks/
  types/
  utils/

## Technical Improvements

- Unit tests for streak calculation
- Refactor statistics logic into pure utility functions
- User profile
- Add rewards for achieving goals