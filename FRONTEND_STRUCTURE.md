# CREV AI — Frontend Structure

> **Framework:** React 19 + Vite 8 · **Routing:** React Router DOM 7  
> **Code Editor:** Monaco Editor (via @monaco-editor/react)  
> **3D / Visuals:** Three.js + React Three Fiber + Drei  
> **Styling:** CSS Modules  
> **Dev Server Port:** 5173

---

## Directory Tree

```
src/
├── main.jsx                                     # App entry point, React Router setup
├── App.jsx                                      # Root layout — Sidebar + <Outlet> + AIChatbot
├── App.css                                      # Global reset & CSS variables
├── App.module.css                               # Layout styles (app shell grid)
├── index.css                                    # Base styles, fonts, theme variables
│
├── assets/
│   ├── bot.png                                  # Chatbot avatar image
│   ├── hero.png                                 # Hero/landing image
│   ├── react.svg                                # React logo
│   └── vite.svg                                 # Vite logo
│
├── components/
│   ├── AIChatbot/
│   │   ├── AIChatbot.jsx                        # Chat panel UI — messages, input, suggestions
│   │   ├── AIChatbot.module.css                 # Chat panel, FAB trigger, animations
│   │   ├── AiOrb.jsx                            # 3D animated orb (React Three Fiber)
│   │   └── useGemini.js                         # Gemini API integration hook
│   │
│   ├── CodeEditor/
│   │   ├── CodeEditor.jsx                       # Monaco code editor wrapper
│   │   └── CodeEditor.module.css                # Editor container styles
│   │
│   ├── HistoryList/
│   │   ├── HistoryList.jsx                      # Past reviews list with scores
│   │   └── HistoryList.module.css               # History card styles
│   │
│   ├── IssueCard/
│   │   ├── IssueCard.jsx                        # Individual code issue display
│   │   └── IssueCard.module.css                 # Severity badges, issue layout
│   │
│   ├── LanguageSelector/
│   │   ├── LanguageSelector.jsx                 # Dropdown to pick programming language
│   │   └── LanguageSelector.module.css          # Selector styles
│   │
│   ├── ReviewPanel/
│   │   ├── ReviewPanel.jsx                      # Review results — score + issues list
│   │   └── ReviewPanel.module.css               # Panel layout, scrollable results
│   │
│   ├── ScoreDisplay/
│   │   ├── ScoreDisplay.jsx                     # Visual score gauge / indicator
│   │   └── ScoreDisplay.module.css              # Circular score animation
│   │
│   ├── Sidebar/
│   │   ├── Sidebar.jsx                          # Navigation sidebar — Review, History, Settings
│   │   └── Sidebar.module.css                   # Sidebar layout, nav items, user section
│   │
│   ├── Toast/
│   │   ├── Toast.jsx                            # Toast notification component
│   │   └── Toast.module.css                     # Toast slide-in animation
│   │
│   └── TopBar/
│       ├── TopBar.jsx                           # Top navigation bar with actions
│       └── TopBar.module.css                    # TopBar layout styles
│
├── contexts/
│   └── ThemeContext.jsx                          # Dark/Light mode context provider
│
├── hooks/
│   ├── useAutoDetect.js                         # Auto-detect programming language from code
│   └── useReview.js                             # Hook to call backend review API
│
├── pages/
│   ├── ReviewPage.jsx                           # Main page — CodeEditor + ReviewPanel
│   └── HistoryPage.jsx                          # History page — past review list
│
└── utils/
    └── monacoTheme.js                           # Custom Monaco editor dark theme
```

### Root-Level Files

```
AI Code Review Dashboard/
├── index.html                                   # Vite HTML entry point
├── package.json                                 # NPM scripts & dependencies
├── vite.config.js                               # Vite configuration
├── eslint.config.js                             # ESLint rules
└── public/
    ├── favicon.svg                              # Browser tab icon
    └── icons.svg                                # SVG icon sprite
```

---

## Architecture Flow

```
┌──────────────────────────────────────────────────────────┐
│                        App.jsx                           │
│  ┌──────────┐    ┌──────────────────┐   ┌────────────┐  │
│  │ Sidebar  │    │     <Outlet>     │   │ AIChatbot  │  │
│  │          │    │  ┌────────────┐  │   │ (floating)  │  │
│  │ • Review │    │  │ ReviewPage │  │   └────────────┘  │
│  │ • History│    │  │ HistoryPage│  │                    │
│  │ • Settings│   │  └────────────┘  │                    │
│  └──────────┘    └──────────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

### Review Flow

```
User pastes code ──▶ CodeEditor (Monaco)
                          │
    LanguageSelector ◀────┤  (auto-detect or manual)
                          │
              "Run Review" click
                          │
                          ▼
                   useReview hook ──▶ POST /api/reviews (Backend)
                          │
                          ▼
                   ReviewPanel
                    ├── ScoreDisplay (gauge)
                    └── IssueCard[] (list of issues)
```

### AI Chatbot Flow

```
User clicks bot avatar (FAB) ──▶ AIChatbot panel opens
                                       │
                                 User types question
                                       │
                                       ▼
                                useGemini.js ──▶ Gemini API
                                       │
                                       ▼
                              AI response displayed
```

---

## Key Components

| Component           | Purpose                                        |
|---------------------|------------------------------------------------|
| `App.jsx`           | Root layout — sidebar + page outlet + chatbot  |
| `Sidebar`           | Navigation menu + user info + dark mode toggle |
| `CodeEditor`        | Monaco-based code input with syntax highlight  |
| `LanguageSelector`  | Pick or auto-detect programming language       |
| `ReviewPanel`       | Displays AI review results                     |
| `ScoreDisplay`      | Animated score gauge                           |
| `IssueCard`         | Individual code issue with severity badge      |
| `HistoryList`       | List of past code reviews                      |
| `AIChatbot`         | Floating AI assistant chat panel               |
| `Toast`             | Notification pop-ups                           |
| `TopBar`            | Top bar with actions (Run Review, etc.)        |

---

## Pages & Routing

| Route       | Page              | Description                     |
|-------------|-------------------|---------------------------------|
| `/`         | `ReviewPage.jsx`  | Main code review interface      |
| `/history`  | `HistoryPage.jsx` | Past reviews list               |

---

## Dependencies (package.json)

- **react / react-dom** — UI framework (v19)
- **react-router-dom** — Client-side routing (v7)
- **@monaco-editor/react** — Code editor component
- **three** — 3D graphics engine
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — Three.js helpers & abstractions
- **vite** — Dev server & bundler (v8)
