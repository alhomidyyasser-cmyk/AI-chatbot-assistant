# AI Chatbot Assistant — Neural Network Studio

Interactive AI chatbot with a locally-trained neural network, NLP pipeline visualization, and intent management. All processing runs entirely in the browser — no server required.

## Features

- **Local Neural Network** — Feedforward network with 2 hidden layers (8×8), auto-trains on page load
- **NLP Pipeline** — Tokenization, stemming, and Bag of Words vectorization
- **Intent Management** — CRUD editor for patterns and responses
- **Training Dashboard** — Real-time loss/accuracy charts and training logs
- **Theme System** — Light/Dark mode with CSS variable-based design tokens

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
```

Output will be in the `dist/` directory.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Motion (Framer)
- Lucide Icons
