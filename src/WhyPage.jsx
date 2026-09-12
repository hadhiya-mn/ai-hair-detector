import { Link } from "react-router-dom"
import "./WhyPage.css"

function WhyPage() {
  return (
    <main className="why-page">

      {/* ================= HEADER ================= */}
      <header className="why-header">

        <div className="why-logo">
          AI HAIR DETECTOR
        </div>

        <nav className="why-nav">
          <Link to="/">Home</Link>

          <Link to="/scan">
            How it Works
          </Link>

          <Link to="/why" className="active">
            Why?
          </Link>

          <Link to="/about">
            About
          </Link>
        </nav>

      </header>


      {/* ================= FLOATING DECORATIONS ================= */}

      <div className="why-decoration crown">♛</div>

      <div className="why-decoration star star-1">
        ✦
      </div>

      <div className="why-decoration star star-2">
        ✦
      </div>

      <div className="why-decoration star star-3">
        ✦
      </div>

      <div className="why-decoration plus plus-1">
        +
      </div>

      <div className="why-decoration plus plus-2">
        +
      </div>

      <div className="why-decoration plus plus-3">
        +
      </div>


      {/* ================= LEFT STICKER ================= */}

      <div className="fun-sticker sticker-left">
        IT'S
        <br />
        JUST
        <br />
        FOR FUN!
      </div>


      {/* ================= RIGHT STICKER ================= */}

      <div className="fun-sticker sticker-right">
        MORE HAIR.
        <br />
        MORE CONFIDENCE?
        <br />
        <strong>MAYBE.</strong>
      </div>


      {/* ================= MAIN CONTENT ================= */}

      <section className="why-content">

        {/* WHY BADGE */}
        <div className="why-badge">
          WHY?
        </div>


        {/* TITLE */}
        <h1 className="why-title">
          WHY COUNT HAIR?
        </h1>


        {/* SUBTITLE */}
        <div className="why-subtitle">
          Because we can. 😂
        </div>

        <div className="pink-line"></div>


        {/* ================= THREE CARDS ================= */}

        <div className="why-cards">

          {/* CARD 1 */}
          <div className="why-card pink-card floating-card card-one">

            <h2>
              IS IT USEFUL?
            </h2>

            <div className="card-icon cross">
              ✕
            </div>

            <h3>
              Not really.
            </h3>

            <p>
              You already know
              <br />
              you have hair.
            </p>

          </div>


          {/* CARD 2 */}
          <div className="why-card yellow-card floating-card card-two">

            <h2>
              IS IT ACCURATE?
            </h2>

            <div className="card-icon">
              🤷
            </div>

            <h3>
              Probably not.
            </h3>

            <p>
              But it's close enough
              <br />
              to be fun.
            </p>

          </div>


          {/* CARD 3 */}
          <div className="why-card pink-card floating-card card-three">

            <h2>
              DID WE BUILD IT
              <br />
              ANYWAY?
            </h2>

            <div className="card-icon check">
              ✓
            </div>

            <h3>
              Absolutely.
            </h3>

            <p>
              Because some ideas
              <br />
              don't need a reason.
            </p>

          </div>

        </div>


        {/* ================= BIG MESSAGE ================= */}

        <div className="big-message floating-message">

          <div>
            YOU ALREADY KNOW YOU HAVE HAIR.
          </div>

          <strong>
            BUT NOW YOU CAN KNOW EXACTLY HOW MUCH.
          </strong>

        </div>


        {/* ================= BOTTOM TAG ================= */}

        <div className="experiment-tag">
          ♧ USELESS-BUT-FUN EXPERIMENT
        </div>


        {/* ================= BOTTOM LEFT ================= */}

        <div className="same-head">
          <div className="smile">
            ☺
          </div>

          <div>
            SAME HEAD.
            <br />
            DIFFERENT
            <br />
            CONFIDENCE.
          </div>
        </div>


        {/* ================= BOTTOM RIGHT ================= */}

        <div className="curiosity-sticker">
          BECAUSE
          <br />
          CURIOSITY
          <br />
          MATTERS!
        </div>

      </section>

    </main>
  )
}

export default WhyPage