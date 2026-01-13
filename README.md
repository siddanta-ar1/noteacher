# NOTEacher

NOTEacher is an elite pedagogy platform designed to "democratize elite teaching" by replacing traditional textbooks with automated, world-class interactive narratives.

## 🚀 Key Features

* **Narrative Arcs**: Concepts are presented as story arcs (Hook, Guide, Resolution) rather than standard chapters.
* **Interactive Scrollytelling**: Textbooks that "move"—animations and theory reveals are triggered by the user's scroll to reduce cognitive load.
* **Elite Pedagogy**: High-engagement content once exclusive to the top 1% is automated for all learners.
* **Gamified Learning**: Includes a leaderboard, narrative badges, and mystery-driven concept exploration.

## 🛠️ Tech Stack

* **Framework**: Next.js 16.1.1 (App Router)
* **UI/Animations**: GSAP (`gsap`), Framer Motion, and Tailwind CSS 4
* **Backend**: Supabase (Auth and Database)
* **Icons**: Lucide React

## 📁 Project Structure

* `app/lesson/[id]`: Dynamic routes for scrollytelling lessons
* `components/lesson/ReadingEngine.tsx`: The core logic for the interactive scroll experience
* `app/simulator`: Interactive environments for scientific or engineering simulations
