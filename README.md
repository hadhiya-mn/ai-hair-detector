# 🧑‍🦲 AI Hair Detector

> Because we can. 😂

**AI Hair Detector** is a fun and experimental computer-vision project that estimates how many hairs are on a person's head using three ordinary photos — **Front, Top, and Back**.

It was built as a **Useless/Fun Hackathon project**, where the goal was not to solve an important problem, but to build something funny, unusual, and technically interesting.

## 💡 What Does It Do?

Upload three photos of a person's head:

- 📸 Front view
- 📸 Top view
- 📸 Back view

The application sends the images to an AI-powered backend, analyzes the visible hair patterns, and produces an estimated **Total Hair Count**.

The result is intentionally presented in a fun, exaggerated way — because nobody actually needs to know their exact hair count. 😎

## 🧠 How It Works

The project uses:

1. **React + Vite** for the interactive frontend
2. **FastAPI** for the backend API
3. **ONNX / ResNet18** for image analysis
4. Computer-vision techniques to estimate hair coverage and texture
5. Three different views of the head to produce a combined estimate

The three individual image estimates are combined into one final hair-count result.

> ⚠️ This is a fun experiment and **not a medically accurate hair-counting system**.

## 🎨 Features

- 🧑‍🦱 AI-based hair estimation
- 📸 Three-view scanning — Front, Top & Back
- 🟢 Animated scanning experience
- 🎉 Fun result and celebration screen
- 🧑‍🦲 Special **Bald Legend** result
- 🪮 Animated comb interaction
- 🔊 Fun sound effects
- ❓ "Any Doubts?" page
- 🤔 "Why Count Hair?" page
- ℹ️ About page
- 🎨 Retro / playful visual design

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- CSS
- JavaScript

### Backend

- Python
- FastAPI
- ONNX Runtime
- OpenCV
- NumPy
- ResNet18

## 📂 Project Structure

```text
ai-hair-detector/
│
├── backend/
│   ├── main.py
│   └── models/
│       └── resnet18.onnx
│
├── public/
│   ├── bald-legend.mpeg
│   └── dialogue.mpeg
│
├── src/
│   ├── App.jsx
│   ├── ScanPage.jsx
│   ├── ScanningPage.jsx
│   ├── DoubtsPage.jsx
│   ├── WhyPage.jsx
│   ├── AboutPage.jsx
│   └── assets/
│
├── package.json
├── vite.config.js
└── README.md
