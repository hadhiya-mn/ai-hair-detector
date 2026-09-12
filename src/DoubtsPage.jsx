import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./DoubtsPage.css"


import doubtCharacter from "./assets/doubt-character.png"

function DoubtsPage() {
 const navigate = useNavigate()
const location = useLocation()
useEffect(() => {
  const audio = new Audio("/dialogue.mpeg")

  audio.play().catch((error) => {
    console.log("Audio playback was blocked:", error)
  })

  return () => {
    audio.pause()
    audio.currentTime = 0
  }
}, [])

  return (
    <main className="doubts-page">

      {/* BACK BUTTON */}

<button
  className="doubts-back-button"
  onClick={() =>
    navigate("/scanning", {
      state: {
        finalCount: location.state?.finalCount,
      },
    })
  }
>
  BACK
</button>


      {/* PIXELATED DECORATIONS */}

      <div className="doubt-star star-one">
        ✦
      </div>

      <div className="doubt-star star-two">
        ✦
      </div>

      <div className="doubt-plus plus-one">
        +
      </div>

      <div className="doubt-plus plus-two">
        +
      </div>


      {/* TITLE */}

      <div className="doubts-heading">

        <div className="small-heading">
          GOT QUESTIONS?
        </div>

        <h1>
          ANY DOUBTS?
        </h1>

        <p>
          Ask the Hair Expert! 🧑‍⚕️
        </p>

      </div>


      {/* CHARACTER */}

      <div className="character-section">

        <img
          src={doubtCharacter}
          alt="Hair expert"
          className="doubt-character"
        />

      </div>
<div className="developed-by">
  developed by 'FAAH' <span>♥</span>
</div>
    </main>
  )
}

export default DoubtsPage