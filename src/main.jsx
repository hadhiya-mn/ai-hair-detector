
import WhyPage from "./WhyPage.jsx"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import ScanPage from "./ScanPage.jsx"
import ScanningPage from "./ScanningPage.jsx"
import DoubtsPage from "./DoubtsPage.jsx"
import AboutPage from "./AboutPage.jsx"


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/scanning" element={<ScanningPage />} />
        <Route path="/doubts" element={<DoubtsPage />} />
        <Route path="/why" element={<WhyPage />} />
        <Route path="/about" element={<AboutPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
)