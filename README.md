# AI Chatbot Assistant — Neural Network Studio

A fully client-side chatbot and neural-network learning studio with an Arabic-first interface. Classification, training, and visualizations all run in the browser; there is no application server and no API key to configure.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)

## Overview

The studio demonstrates a complete intent-classification pipeline: text is tokenized, stemmed, and converted to a binary bag-of-words vector, then classified by a small feedforward neural network with two hidden layers. Predictions, network weights, training metrics, and NLP steps are all exposed through an interactive UI so the model's behavior can be inspected and tuned.

## Features

- **Bilingual chat** — Built-in intent patterns and responses in Arabic and English.
- **Neural-network visualization** — Inspect a feedforward classifier with two hidden layers of eight neurons each, including live weights and activation flow.
- **NLP playground** — Step through tokenization, stemming, and bag-of-words vectorization for any input.
- **Intent editor** — Create, edit, and remove intent tags, example patterns, and responses.
- **Training dashboard** — Retrain the model with a configurable epoch count and review loss, accuracy, and training logs.
- **Light and dark themes** — Theme preference is persisted in browser storage.
- **Accessible UI** — Semantic tabs, keyboard navigation, ARIA labels, and reduced-motion-friendly animations.
- **No backend** — Everything runs locally in the browser.

## Requirements

- Node.js 18 or later
- npm 9 or later

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000. |
| `npm run lint` | Run TypeScript compiler checks (`tsc --noEmit`). |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally after `npm run build`. |
| `npm run clean` | Remove the generated `dist/` directory. |

## Using the studio

1. The model trains automatically when the app loads; wait for the status badge to read **نشط** (active).
2. Send a message in the chat panel. The model predicts an intent and selects a matching response when its confidence meets the threshold.
3. Use the **الشبكة العصبية** (Neural Network) tab to inspect activations, weights, and the winning classification.
4. Use **معالجة اللغة** (Language Processing) to inspect tokenization, stemming, and the bag-of-words vector.
5. Use **البيانات** (Data) to edit intent patterns and responses.
6. Use **التدريب** (Training) to choose an epoch count and retrain against the current intent data.

Intent edits and training data are held in memory and reset when the page is reloaded. The theme preference is persisted separately.

## How it works

1. **Tokenization** — Input is lowercased and split on whitespace; punctuation is stripped while Unicode letters and digits are preserved.
2. **Stemming** — A lightweight Porter-like stemmer reduces English suffixes. Arabic tokens are preserved as-is.
3. **Vectorization** — Tokens are stemmed and matched against the vocabulary to build a binary bag-of-words vector.
4. **Classification** — A feedforward network (`vocab × 8 × 8 × classes`) with ReLU hidden activations and a softmax output layer produces per-intent probabilities.
5. **Response selection** — When the top prediction's confidence is at least `0.8`, a response is chosen at random from that intent's response list.

The stemmer is a compact, educational implementation rather than a full linguistic analyzer. Web fonts are loaded from Google Fonts; if that request fails, the browser falls back to system fonts. Chat and training do not depend on it.

## Project structure

```text
src/
├── components/        UI panels, chat, and visualizations
│   └── ui/            Reusable design-system components
├── data/              Built-in intent patterns and responses
├── hooks/             Chat, model, and theme state
└── utils/             Neural-network and text-processing logic
```

## Technology

- **React 19** with **TypeScript 5.8**
- **Vite 6** for development and bundling
- **Tailwind CSS 4** with CSS-variable design tokens
- **Motion** for animations
- **Lucide** for icons
- **Cairo + Tajawal** for typography, **JetBrains Mono** for code and metrics

## Configuration

No environment variables are required for the core application. `.env.example` is included for reference.

## Browser support

The app targets modern evergreen browsers (Chrome, Edge, Firefox, Safari). It requires JavaScript and `localStorage` for theme persistence.

## License

This project is provided as-is for educational and demonstration purposes.