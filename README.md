# NOTEacher

**NOTEacher** is an elite pedagogy platform designed to "democratize elite teaching" by replacing traditional textbooks with automated, world-class interactive narratives. It transforms complex concepts into engaging, story-driven experiences that adapt to the learner.

## 🚀 Key Features

*   **Narrative Arcs**: Concepts are presented as compelling story arcs (Hook, Guide, Resolution) rather than dry chapters.
*   **Interactive Scrollytelling**: Textbooks that "move"—animations, theory reveals, and diagrams are triggered by the user's scroll to reduce cognitive load and maintain engagement.
*   **Immersive Simulations**: Over 15+ interactive simulations including:
    *   **Anchoring Bias**: Experience how initial information skews judgment.
    *   **Crowd Estimator**: Test the "Wisdom of Crowds" phenomenon.
    *   **Monte Carlo Simulations**: Visualizing probability and risk.
    *   **The Ban Button**: exploring censorship and moderation dynamics.
    *   *And many more...*
*   **AI Integration**:
    *   **AI Teacher**: Real-time assistance and explanations using advanced models (Arcee Trinity, Llama 3 via OpenRouter).
    *   **Vision Analysis**: Handwriting recognition for assignment submission (powered by Google Gemini Vision).
    *   **Auto-Summaries**: Smart summarization of lesson content.
*   **Gamified Learning**: Keep motivation high with a global leaderboard, daily streaks, and narrative-driven badges.
*   **Cross-Platform**: Available on Web and Android (via Capacitor).

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16.1.1 (App Router)](https://nextjs.org/)
*   **Language**: TypeScript, React 19
*   **Styling & UI**:
    *   [Tailwind CSS 4](https://tailwindcss.com/)
    *   [GSAP](https://gsap.com/) (GreenSock Animation Platform) for high-performance animations
    *   [Framer Motion](https://www.framer.com/motion/) for React component animations
    *   [Lucide React](https://lucide.dev/) for icons
*   **Backend & Auth**: [Supabase](https://supabase.com/) (Auth, Database, Realtime)
*   **AI & ML**:
    *   [OpenRouter SDK](https://openrouter.ai/) (Access to Llama 3, Arcee Trinity)
    *   [Google Generative AI](https://ai.google.dev/) (Gemini)
*   **Mobile**: [Capacitor 8](https://capacitorjs.com/) (Android)

## 📁 Project Structure

```bash
/app
  /lesson/[id]       # Dynamic scrollytelling lesson pages
  /simulator         # Standalone simulation pages
  /api               # Next.js API routes
/components
  /blocks            # Reusable content blocks (Text, Quiz, Video, etc.)
  /simulations       # Interactive simulation components (AnchoringSim, etc.)
  /lesson            # Lesson-specific components (ReadingEngine, Sidebar)
/lib
  ai-client.ts       # AI service configuration and client
  supabase.ts        # Supabase client initialization
/services            # Business logic (Auth, Course, Progress tracking)
/android             # Native Android project files (Capacitor)
```

## 🏁 Getting Started

### Prerequisites

*   Node.js (v20 or higher)
*   npm or pnpm

### Environment Variables

Create a `.env.local` file in the root directory with the following keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/noteacher.git
    cd noteacher
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    pnpm install
    ```

### Running Locally

**Web Development:**

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Android Development:**

1.  Sync web assets to the native project:
    ```bash
    npm run cap:sync
    ```
2.  Open in Android Studio:
    ```bash
    npm run cap:open
    ```
    *Or run the combined command:*
    ```bash
    npm run android
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT License](LICENSE)
