import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./ScanningPage.css"
import comb from "./assets/comb.png"

const API_URL = "http://127.0.0.1:8000/api/scan"

const views = [
  { key: "front", label: "FRONT", index: 1 },
  { key: "top", label: "TOP", index: 2 },
  { key: "back", label: "BACK", index: 3 },
]

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

async function scanImage(file) {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Scan failed")
  }

  return response.json()
}

function ScanningPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const baldAudioPlayed = useRef(false)

  const images = location.state?.images

  const [currentIndex, setCurrentIndex] = useState(0)
  const [status, setStatus] = useState("PREPARING SCAN...")

  const [finalCount, setFinalCount] = useState(
    location.state?.finalCount ?? null
  )

  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const currentView = views[currentIndex]

  // =================================================
  // CREATE TEMPORARY PREVIEW URLS
  // =================================================

  const [imageUrls, setImageUrls] = useState({
    front: "",
    top: "",
    back: "",
  })

  useEffect(() => {
    if (!images) return

    const frontUrl = images.front
      ? URL.createObjectURL(images.front)
      : ""

    const topUrl = images.top
      ? URL.createObjectURL(images.top)
      : ""

    const backUrl = images.back
      ? URL.createObjectURL(images.back)
      : ""

    setImageUrls({
      front: frontUrl,
      top: topUrl,
      back: backUrl,
    })

    return () => {
      if (frontUrl) URL.revokeObjectURL(frontUrl)
      if (topUrl) URL.revokeObjectURL(topUrl)
      if (backUrl) URL.revokeObjectURL(backUrl)
    }
  }, [images])

  // =================================================
  // SCANNING
  // =================================================

  useEffect(() => {
    // Coming back from the Doubts page with an existing result
    if (location.state?.finalCount !== undefined) {
      return
    }

    if (!images?.front || !images?.top || !images?.back) {
      navigate("/scan", { replace: true })
      return
    }

    let cancelled = false

    const runScan = async () => {
      try {
        // =========================
        // FRONT
        // =========================

        setCurrentIndex(0)
        setProgress(5)
        setStatus("SCANNING FRONT VIEW...")

        const frontStart = Date.now()

        const frontResult = await scanImage(images.front)

        const frontElapsed = Date.now() - frontStart

        if (frontElapsed < 2500) {
          await wait(2500 - frontElapsed)
        }

        if (cancelled) return

        setProgress(33)

        // =========================
        // TOP
        // =========================

        setCurrentIndex(1)
        setProgress(38)
        setStatus("SCANNING TOP VIEW...")

        const topStart = Date.now()

        const topResult = await scanImage(images.top)

        const topElapsed = Date.now() - topStart

        if (topElapsed < 2500) {
          await wait(2500 - topElapsed)
        }

        if (cancelled) return

        setProgress(66)

        // =========================
        // BACK
        // =========================

        setCurrentIndex(2)
        setProgress(71)
        setStatus("SCANNING BACK VIEW...")

        const backStart = Date.now()

        const backResult = await scanImage(images.back)

        const backElapsed = Date.now() - backStart

        if (backElapsed < 2500) {
          await wait(2500 - backElapsed)
        }

        if (cancelled) return

        setProgress(100)
        setStatus("SCAN COMPLETE!")

        // =========================
        // FINAL ESTIMATE
        // =========================

        const allResults = [
          frontResult.hairCount,
          topResult.hairCount,
          backResult.hairCount,
        ]

        const finalEstimate = Math.round(
          allResults.reduce(
            (sum, value) => sum + value,
            0
          ) / allResults.length
        )

        // Small pause so user sees 100%
        await wait(800)

        if (cancelled) return

        setFinalCount(finalEstimate)

      } catch (err) {
        console.error(err)

        if (!cancelled) {
          setError(
            "Could not complete the hair scan. Please make sure the backend is running."
          )
        }
      }
    }

    runScan()

    return () => {
      cancelled = true
    }
  }, [images, navigate, location.state?.finalCount])

  // =================================================
  // BALD LEGEND AUDIO
  // =================================================

  useEffect(() => {
    if (finalCount !== 0) return
    if (baldAudioPlayed.current) return

    baldAudioPlayed.current = true

    const audio = new Audio("/bald-legend.mpeg")

    audio.volume = 1

    const timer = setTimeout(() => {
      audio.play().catch((error) => {
        console.log("Bald audio could not play:", error)
      })
    }, 700)

    return () => {
      clearTimeout(timer)
      audio.pause()
      audio.currentTime = 0
    }
  }, [finalCount])

  // =================================================
  // FORMATTED COUNT
  // =================================================

  const formattedCount =
    finalCount !== null
      ? finalCount.toLocaleString("en-IN")
      : ""

  // =================================================
  // ERROR SCREEN
  // =================================================

  if (error) {
    return (
      <div className="scanning-page">

        <div className="retro-frame">

          <div className="error-sticker">
            ⚠
          </div>

          <h1 className="error-title">
            SCAN FAILED
          </h1>

          <p className="error-message">
            {error}
          </p>

          <button
            className="retro-button"
            onClick={() => navigate("/scan")}
          >
            ← TRY AGAIN
          </button>

        </div>

      </div>
    )
  }

  // =================================================
  // FINAL RESULT
  // =================================================

  if (finalCount !== null) {
    return (
      <div className="scanning-page result-page">

        <div className="retro-frame result-frame">

          <div className="result-spark spark-one">
            ✦
          </div>

          <div className="result-spark spark-two">
            +
          </div>

          <div className="result-sticker">
            MUDI
            <br />
            MATTERS!
          </div>

          <div className="result-title">
            TOTAL HAIR COUNT
          </div>

          <div className="result-number">
            {formattedCount}
          </div>

          {/* =================================================
              BALD / NORMAL CELEBRATION
          ================================================= */}

          {finalCount === 0 ? (

            <div className="bald-moment">

              <div className="bald-head">
                🧑‍🦲
              </div>

              <div className="bald-title">
                BALD LEGEND!
              </div>

              <div className="bald-message">
                NOT A SINGLE STRAND SURVIVED. 💀
              </div>

              <div className="bald-comb-wrapper">
                <img
                  src={comb}
                  alt="Comb"
                  className="bald-flying-comb"
                />
              </div>

              <div className="bald-joke">
                THE COMB IS OFFICIALLY USELESS! 😂
              </div>

              <div className="bald-confetti">
                <span>✦</span>
                <span>+</span>
                <span>✦</span>
                <span>•</span>
                <span>+</span>
                <span>✦</span>
              </div>

            </div>

          ) : (

            <div className="celebration-wrapper">

              <span className="confetti confetti-1">
                ✦
              </span>

              <span className="confetti confetti-2">
                +
              </span>

              <span className="confetti confetti-3">
                ✦
              </span>

              <span className="confetti confetti-4">
                •
              </span>

              <span className="confetti confetti-5">
                +
              </span>

              <div className="result-party">
                🎉
              </div>

            </div>

          )}

          {/* =================================================
              RESULT MESSAGE
          ================================================= */}

          <p className="result-text">

            {finalCount === 0
              ? "The mudi has officially disappeared."
              : "Your magnificent mudi has officially been counted!"}

          </p>

          <div className="result-note">

            <span>💡</span>

            <div>
              <strong>AI HAIR DETECTOR</strong>
              <br />
              Probably accurate. Definitely fun.
            </div>

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <button
            className="retro-button"
            onClick={() => navigate("/scan")}
          >
            SCAN AGAIN →
          </button>

          <button
            className="retro-button doubts-button"
            onClick={() =>
              navigate("/doubts", {
                state: {
                  images,
                  finalCount,
                },
              })
            }
          >
            ANY DOUBTS?
          </button>

        </div>

      </div>
    )
  }

  // =================================================
  // CURRENT IMAGE
  // =================================================

  const currentImage = imageUrls[currentView.key]

  // =================================================
  // SCANNING SCREEN
  // =================================================

  return (
    <div className="scanning-page">

      {/* =========================
          DECORATIONS
      ========================= */}

      <div className="dot-pattern dots-left"></div>

      <div className="dot-pattern dots-right"></div>

      <div className="pixel-decoration cyan-plus">
        +
      </div>

      <div className="pixel-decoration yellow-star">
        ✦
      </div>

      <div className="pixel-decoration pink-plus">
        +
      </div>

      {/* =========================
          HEADER
      ========================= */}

      <header className="retro-header">

        <div className="brand">
          AI HAIR DETECTOR
        </div>

        <div className="header-right">

          <div className="smiley">
            😎
          </div>

          <div className="page-number">
            {currentView.index} / 3
          </div>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="scanner-main">

        {/* ANALYSING */}

        <div className="analysing-label">
          ANALYSING
        </div>

        {/* VIEW TITLE */}

        <div className="view-title-box">
          <h1>
            {currentView.label} VIEW
          </h1>
        </div>

        <div className="scan-subtitle-retro">
          SCANNING YOUR MUDI...
        </div>

        {/* =========================
            SIDE STICKER LEFT
        ========================= */}

        <div className="side-sticker left-sticker">

          <strong>
            MUDI
            <br />
            MATTERS!
          </strong>

        </div>

        <div className="side-message left-message">

          MORE HAIR.
          <br />
          MORE
          <br />
          CONFIDENCE?
          <br />
          MAYBE.

        </div>

        {/* =========================
            SIDE STICKER RIGHT
        ========================= */}

        <div className="side-sticker right-sticker">

          JUST A
          <br />
          SECOND...

        </div>

        <div className="hourglass">
          ⌛
        </div>

        {/* =========================
            IMAGE SCANNER
        ========================= */}

        <div className="scanner-card">

          <div className="scanner-inner">

            {/* Corner brackets */}

            <div className="scan-corner top-left"></div>

            <div className="scan-corner top-right"></div>

            <div className="scan-corner bottom-left"></div>

            <div className="scan-corner bottom-right"></div>

            {currentImage && (
              <img
                src={currentImage}
                alt={`${currentView.label} view`}
                className="scanned-photo"
              />
            )}

            {/* Grid */}

            <div className="scan-grid"></div>

            {/* Green scanning line */}

            <div className="retro-scan-line"></div>

          </div>

        </div>

        {/* =========================
            PROGRESS STEPS
        ========================= */}

        <div className="step-tracker">

          {views.map((view, index) => (

            <div
              key={view.key}
              className={`tracker-item ${
                index === currentIndex
                  ? "active"
                  : ""
              } ${
                index < currentIndex
                  ? "completed"
                  : ""
              }`}
            >

              <div className="tracker-circle">

                {index < currentIndex
                  ? "✓"
                  : index + 1}

              </div>

              <span>
                {view.label}
              </span>

            </div>

          ))}

        </div>

        {/* =========================
            PROGRESS BAR
        ========================= */}

        <div className="progress-wrapper">

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>

            <span className="progress-text">
              SCANNING {currentView.label} VIEW...
            </span>

          </div>

          <div className="progress-percent">
            {progress}%
          </div>

        </div>

        {/* =========================
            BOTTOM MESSAGE
        ========================= */}

        <div className="scanner-note">

          <div className="note-icon">
            💡
          </div>

          <div className="note-text">

            Our AI is carefully analysing
            <br />
            your hair. Almost there!

          </div>

        </div>

      </main>

    </div>
  )
}

export default ScanningPage