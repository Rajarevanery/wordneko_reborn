# 🐱 WordNeko

# 🐱 WordNeko — Game Description

**WordNeko** is a fast-paced, skill-based word game that blends classic **Wordle-style deduction** with **spelling endurance** and **speedrun mechanics**. Players must think quickly, manage limited lives, and build vocabulary across multiple game modes — all while competing on global leaderboards.

The game is designed to reward **accuracy, speed, and consistency**, not just luck.

---

## 🎮 Core Gameplay

WordNeko revolves around guessing and spelling words under different constraints:

- Each game session selects **unique words only** — no duplicates are allowed
- Words are processed **sequentially** to guarantee fairness and avoid repetition
- Players can **skip a word**, but doing so consumes a life  
  - If the player has only **1 life left**, skipping is disabled

Lives, timers, and scoring create real tension and strategy.

---

## ⌨️ Smart Keyboard Feedback

The on-screen keyboard reacts dynamically to player input:

- 🟩 **Green** — correct letter in the correct position  
- 🟨 **Yellow** — correct letter in the wrong position  
- ⬛ **Black** — letter not in the word  

Keyboard state persists across guesses, giving players reliable visual feedback based on their submitted words.

---

## 🧠 Game Modes

### 🟩 Classic Wordle Mode

- Word deduction with limited HP (similar to Spelling mode)
- Word history tracking
- Enhanced scoring based on:
  - Word length
  - Time taken per word
- Higher EXP rewards (**2×–4×** compared to Spelling mode)

---

### ⚡ Speedrun / Timed Mode

- Continuous word challenges under a timer
- Timer stops immediately when the game ends
- Score is calculated per session
- Leaderboard support (upload fixed)

---

## 🏆 Scoring & Progression

Scoring is designed to reward **skillful play**:

- Longer words = higher score
- Faster completion = bonus EXP
- Wordle modes give significantly more EXP than Spelling
- Session-based top scores are tracked (e.g. **Top 5 runs per user**)

Leaderboards rank players **globally** and **by country**.

---

## 👤 Player Profile & Statistics

Each player has a unified profile containing:

- Profile information (name, avatar, country)
- Game statistics
- Recent scores
- Top session records

### Edge Case Handling

- New players with no play history see **"None"** / **"No scores"**
- Prevents infinite loading loops

All profile edits are synced directly with the **database**, not just authentication metadata.

---

## 📚 Vocabulary System

WordNeko also functions as a learning tool:

- Players can **save vocabulary** they encounter
- Words can be **categorized** (Anki-style)
- Duplicate words are automatically blocked within the same category

This allows WordNeko to double as a **personal vocabulary trainer**.

---

## 🔐 Authentication & Security

- Clean, redesigned login & registration flow
- Registration includes:
  - Profile picture
  - Country selection (used for rankings)
- **Row Level Security (RLS)** enabled on Supabase tables after feature completion



---

## ✨ Features

- ⚡ Lightning-fast dev experience with **Vite**
- 🧠 Word generation & validation
- 🔐 Authentication flow (Sign In / Sign Up)
- 🎵 Sound effects using Howler
- 🎉 Animations & confetti
- 📊 Excel export support
- 🛡️ hCaptcha integration
- 🔄 Server state management with React Query
- 🎨 Styled with Tailwind CSS

---

## 🧱 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router v7
- Tailwind CSS
- Motion (animations)

### State & Data
- @tanstack/react-query
- Axios
- Supabase

### Utilities
- Howler
- random-words
- an-array-of-english-words
- xlsx
- debounce
- worker-timers

---

## 📁 Project Structure

```txt
wordneko/
├─ src/
│  ├─ _auth/
│  │  ├─ layout/
│  │  │  └─ AuthLayout.tsx
│  │  └─ pages/
│  │     ├─ Signin.tsx
│  │     └─ Signup.tsx
│  │
│  ├─ _root/
│  │  ├─ layout/
│  │  └─ pages/
│  │
│  ├─ api/
│  │  └─ api.ts
│  │
│  ├─ assets/
│  │  ├─ react.svg
│  │  └─ speedle_icon.png
│  │
│  ├─ components/
│  ├─ constant/
│  ├─ context/
│  ├─ lib/
│  ├─ routes/
│  ├─ styles/
│  ├─ ts/
│  │
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
│
├─ index.html
├─ package.json
├─ README.md
└─ vite.config.ts

