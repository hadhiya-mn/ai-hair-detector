import { Link } from "react-router-dom"
import "./App.css"
import "./WhyPage.css"
import character from "./assets/character.png"
import title from "./assets/title.png"
import comb from "./assets/comb.png"
import mudi from "./assets/mudi.png"
import { useNavigate } from "react-router-dom"

function App() {
  const navigate = useNavigate()

  return (
    <div className="app">

      {/* HEADER */}
      <header className="navbar">
        <div className="logo">AI HAIR DETECTOR</div>

        <nav>
          <a href="#home">Home</a>
         <Link to="/scan">How it Works</Link>
         <Link to="/why">Why?</Link>
         <Link to="/about">About</Link>
        </nav>
      </header>

      {/* HERO */}
      <main className="hero">

        {/* LEFT */}
        <section className="character-area">

          <div className="pink-blob"></div>

          {/* PIXEL DECORATIONS */}
          <div className="pixel-cross cross-one">+</div>
          <div className="pixel-cross cross-two">+</div>

          <div className="pixel-star star-one">✦</div>
          <div className="pixel-star star-two">✦</div>

          {/* EXTRA FLOATING PIXEL STARS */}
          <div className="pixel-star extra-star star-three">✦</div>
          <div className="pixel-star extra-star star-four">✦</div>
          <div className="pixel-star extra-star star-five">✦</div>
          <div className="pixel-star extra-star star-six">✦</div>

          <div className="crown">♛</div>

          <img
            src={character}
            alt="Character sitting on a throne"
            className="character"
          />

          <div className="speech-bubble">
            <strong>8,36,333</strong>
            <span>മുടിക്കൾ 🔥</span>
          </div>

        </section>

        {/* RIGHT */}
        <section className="hero-content">

          {/* MUDI MATTERS */}
          <img
            src={mudi}
            alt="Mudi Matters"
            className="mudi-tag"
          />

          {/* MAIN TITLE */}
          <img
            src={title}
            alt="AI Hair Detector"
            className="title-image"
          />

          {/* INSPIRED TEXT */}
          <div className="inspired">
            <span>Inspired from</span>
            <strong>“Mr Son in Law”</strong>
            <div className="pink-underline"></div>
          </div>

          {/* TAGLINE */}
          <p className="tagline">
            MORE HAIR. MORE CONFIDENCE? MAYBE.
          </p>

          {/* SCAN BUTTON */}
          <button
            className="scan-button"
            onClick={() => navigate("/scan")}
          >
            START HAIR SCAN
            <span>→</span>
          </button>

          {/* FLOATING COMB */}
          <img
            src={comb}
            alt="Comb"
            className="comb floating-sticker"
          />

          {/* FLOATING PIXEL FACE */}
          <div className="pixel-face floating-face">
            😎
          </div>

        </section>

      </main>

    </div>
  )
}

export default App