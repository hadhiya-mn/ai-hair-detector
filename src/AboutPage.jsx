import { Link } from "react-router-dom"
import "./AboutPage.css"

function AboutPage() {
  return (
    <main className="about-page">

      {/* HEADER */}
      <header className="about-header">

        <div className="about-logo">
          AI HAIR DETECTOR
        </div>

        <nav className="about-nav">
          <Link to="/">Home</Link>
          <Link to="/scan">How it Works</Link>
          <Link to="/why">Why?</Link>
          <Link to="/about" className="active">About</Link>
        </nav>

      </header>


      {/* FLOATING DECORATIONS */}

      <div className="about-star about-star-one">✦</div>
      <div className="about-star about-star-two">✦</div>
      <div className="about-star about-star-three">✦</div>

      <div className="about-plus about-plus-one">+</div>
      <div className="about-plus about-plus-two">+</div>


      {/* STICKERS */}

      <div className="about-sticker about-sticker-left">
        JUST
        <br />
        FOR
        <br />
        FUN! 😂
      </div>

      <div className="about-sticker about-sticker-right">
        BUILT FROM
        <br />
        CURIOSITY
      </div>


      {/* MAIN */}

      <section className="about-content">

        <div className="about-badge">
          ABOUT
        </div>


        <h1 className="about-title">
          JUST A CURIOUS IDEA
        </h1>


        <p className="about-intro">
          AI Hair Detector was built simply out of curiosity —
          to see what AI could do with something completely
          unnecessary.
        </p>

        <div className="about-line"></div>


        {/* CARDS */}

        <div className="about-cards">

          <div className="about-card pink-about-card">

            <div className="about-icon">
              💡
            </div>

            <h2>
              BUILT FOR CURIOSITY
            </h2>

            <p>
              We wanted to explore what AI could do,
              have some fun, and build something
              completely different.
            </p>

          </div>


          <div className="about-card yellow-about-card">

            <div className="about-icon">
              🎬
            </div>

            <h2>
              INSPIRED BY A MOVIE
            </h2>

            <p>
              The idea was inspired by the fun
              hair-counting concept from
              <strong> "Mr Son in Law" </strong>.
            </p>

          </div>

        </div>


        {/* QUOTE */}

        <div className="about-quote">

          <span className="quote-mark">
            “
          </span>

          <div>
            Some ideas don't need a reason.
            <br />
            <strong>
              Just curiosity.
            </strong>
          </div>

          <span className="quote-mark quote-end">
            ”
          </span>

        </div>


        {/* CLOSING */}

        <div className="about-bottom">

          <h2>
            THAT'S BASICALLY IT. 😎
          </h2>

          <p>
            A useless idea.
            <br />
            A little AI.
            <br />
            And a lot of curiosity.
          </p>

        </div>


        {/* ONLY FAAH MENTION */}

        <div className="developed-by">
          Developed by <strong>FAAH</strong>
        </div>

      </section>

    </main>
  )
}

export default AboutPage