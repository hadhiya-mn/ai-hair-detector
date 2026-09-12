import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./ScanPage.css"

import comb from "./assets/comb.png"

function ScanPage() {
  const navigate = useNavigate()

  const [images, setImages] = useState({
    front: null,
    top: null,
    back: null,
  })

  const [previews, setPreviews] = useState({
    front: null,
    top: null,
    back: null,
  })

  const [message, setMessage] = useState("")

  // Which upload box is currently selected
  const [selectedView, setSelectedView] = useState(null)

  // Photo options popup
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)

  // Camera popup
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState("")

  // Hidden library input
  const libraryInputRef = useRef(null)

  // Camera references
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cameraStreamRef = useRef(null)


  // =========================================
  // OPEN PHOTO OPTIONS
  // =========================================

  const openPhotoOptions = (view) => {
    setSelectedView(view)
    setShowPhotoOptions(true)
    setCameraError("")
  }


  // =========================================
  // CLOSE PHOTO OPTIONS
  // =========================================

  const closePhotoOptions = () => {
    setShowPhotoOptions(false)
    setSelectedView(null)
  }


  // =========================================
  // CHOOSE FROM LIBRARY
  // =========================================

  const chooseFromLibrary = () => {
    libraryInputRef.current?.click()
  }


  // =========================================
  // TAKE PHOTO
  // =========================================

  const takePhoto = async () => {
    // Close the Add Photo popup
    setShowPhotoOptions(false)

    // Clear any previous camera error
    setCameraError("")

    // Show camera popup
    setShowCamera(true)

    try {
      // Check browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not supported")
      }

      // Ask browser for laptop camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      })

      cameraStreamRef.current = stream

      // Attach camera stream to video
      if (videoRef.current) {
        videoRef.current.srcObject = stream

        try {
          await videoRef.current.play()
        } catch (error) {
          console.log("Video autoplay prevented:", error)
        }
      }

    } catch (error) {
      console.error("Camera error:", error)

      setCameraError(
        "Camera could not be opened. Please allow camera permission and try again."
      )
    }
  }


  // =========================================
  // CLOSE CAMERA
  // =========================================

  const closeCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current
        .getTracks()
        .forEach((track) => track.stop())

      cameraStreamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setShowCamera(false)
    setCameraError("")
  }


  // =========================================
  // CAPTURE PHOTO FROM CAMERA
  // =========================================

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !selectedView) {
      return
    }

    // Make sure camera has loaded
    if (!video.videoWidth || !video.videoHeight) {
      setCameraError("Camera is still loading. Please wait a moment.")
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext("2d")

    if (!context) {
      setCameraError("Could not capture the photo.")
      return
    }

    // Draw current camera frame onto canvas
    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    // Convert canvas to image file
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Could not create the photo.")
          return
        }

        const file = new File(
          [blob],
          `${selectedView}-camera-photo.jpg`,
          {
            type: "image/jpeg",
          }
        )

        // Save image file
        setImages((previous) => ({
          ...previous,
          [selectedView]: file,
        }))

        // Show preview
        setPreviews((previous) => ({
          ...previous,
          [selectedView]: URL.createObjectURL(file),
        }))

        setMessage("")

        // Close camera
        closeCamera()

        // Clear selected view
        setSelectedView(null)
      },
      "image/jpeg",
      0.92
    )
  }


  // =========================================
  // HANDLE LIBRARY PHOTO
  // =========================================

  const handlePhotoSelected = (event) => {
    const file = event.target.files?.[0]

    if (!file || !selectedView) {
      return
    }

    // Save selected image
    setImages((previous) => ({
      ...previous,
      [selectedView]: file,
    }))

    // Create preview
    setPreviews((previous) => ({
      ...previous,
      [selectedView]: URL.createObjectURL(file),
    }))

    setMessage("")

    // Close popup
    setShowPhotoOptions(false)
    setSelectedView(null)

    // Allow selecting same photo again later
    event.target.value = ""
  }


  // =========================================
  // CAMERA CLEANUP
  // =========================================

  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current
          .getTracks()
          .forEach((track) => track.stop())
      }
    }
  }, [])


  // =========================================
  // START SCANNING
  // =========================================

  const startScanning = () => {
    if (!images.front || !images.top || !images.back) {
      setMessage(
        "Please upload Front, Top, and Back images first."
      )
      return
    }

    navigate("/scanning", {
      state: {
        images: {
          front: images.front,
          top: images.top,
          back: images.back,
        },
      },
    })
  }


  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="scan-page">

      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        className="back-home"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>


      {/* =========================
          DECORATIONS
      ========================= */}

      <div className="scan-decoration pink-dots-left"></div>

      <div className="scan-decoration pink-dots-right"></div>

      <div className="scan-pixel pixel-cyan-left">
        ✦
      </div>

      <div className="scan-pixel pixel-pink-left">
        +
      </div>

      <div className="scan-pixel pixel-cyan-bottom">
        +
      </div>

      <div className="scan-pixel pixel-yellow-bottom">
        ✦
      </div>

      <div className="pink-rays">
        <span></span>
        <span></span>
        <span></span>
      </div>


      {/* =========================
          MUDI MATTERS
      ========================= */}

      <div className="scan-sticker">
        <span>MUDI</span>
        <span>MATTERS!</span>
      </div>


      {/* =========================
          COMB STICKER
      ========================= */}

      <img
        src={comb}
        alt="Comb"
        className="scan-comb"
      />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <section className="scan-content">

        {/* TITLE */}

        <div className="scan-title-wrapper">

          <h1 className="scan-heading">
            UPLOAD YOUR IMAGES
          </h1>

          <div className="title-underline">
            <span></span>
            <span></span>
          </div>

        </div>


        {/* SUBTITLE */}

        <p className="scan-subtitle">
          Add clear photos from all three angles.
        </p>


        {/* =========================
            UPLOAD GRID
        ========================= */}

        <div className="upload-grid">


          {/* =========================
              FRONT
          ========================= */}

          <div
            className="upload-card"
            onClick={() => openPhotoOptions("front")}
          >

            <span className="view-label">
              FRONT VIEW
            </span>

            {previews.front ? (

              <img
                src={previews.front}
                alt="Front preview"
                className="image-preview"
              />

            ) : (

              <div className="upload-placeholder">

                <span className="image-icon">
                  ▧
                </span>

                <span>
                  Choose image
                </span>

              </div>

            )}

          </div>


          {/* =========================
              TOP
          ========================= */}

          <div
            className="upload-card"
            onClick={() => openPhotoOptions("top")}
          >

            <span className="view-label">
              TOP VIEW
            </span>

            {previews.top ? (

              <img
                src={previews.top}
                alt="Top preview"
                className="image-preview"
              />

            ) : (

              <div className="upload-placeholder">

                <span className="image-icon">
                  ▧
                </span>

                <span>
                  Choose image
                </span>

              </div>

            )}

          </div>


          {/* =========================
              BACK
          ========================= */}

          <div
            className="upload-card"
            onClick={() => openPhotoOptions("back")}
          >

            <span className="view-label">
              BACK VIEW
            </span>

            {previews.back ? (

              <img
                src={previews.back}
                alt="Back preview"
                className="image-preview"
              />

            ) : (

              <div className="upload-placeholder">

                <span className="image-icon">
                  ▧
                </span>

                <span>
                  Choose image
                </span>

              </div>

            )}

          </div>

        </div>


        {/* =========================
            HIDDEN LIBRARY INPUT
        ========================= */}

        <input
          ref={libraryInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelected}
          hidden
        />


        {/* =========================
            SCAN BUTTON
        ========================= */}

        <button
          className="start-scanning"
          onClick={startScanning}
        >
          START SCANNING →
        </button>


        {/* =========================
            MESSAGE
        ========================= */}

        {message && (
          <p className="scan-message">
            {message}
          </p>
        )}

      </section>


      {/* =================================================
          ADD PHOTO POPUP
      ================================================= */}

      {showPhotoOptions && (

        <div
          className="photo-options-overlay"
          onClick={closePhotoOptions}
        >

          <div
            className="photo-options-popup"
            onClick={(event) => event.stopPropagation()}
          >

            {/* Small handle */}

            <div className="popup-handle"></div>


            {/* Title */}

            <h2>
              Add Photo
            </h2>

            <p className="popup-subtitle">
              Choose how you want to add your photo
            </p>


            {/* =========================
                LIBRARY
            ========================= */}

            <button
              className="photo-option library-option"
              onClick={chooseFromLibrary}
            >

              <span className="photo-option-icon">
                🖼️
              </span>

              <span className="photo-option-text">

                <strong>
                  CHOOSE FROM LIBRARY
                </strong>

                <small>
                  Select a photo from your gallery
                </small>

              </span>

              <span className="photo-option-arrow">
                ›
              </span>

            </button>


            {/* =========================
                CAMERA
            ========================= */}

            <button
              className="photo-option camera-option"
              onClick={takePhoto}
            >

              <span className="photo-option-icon">
                📷
              </span>

              <span className="photo-option-text">

                <strong>
                  TAKE PHOTO
                </strong>

                <small>
                  Open camera and take a photo
                </small>

              </span>

              <span className="photo-option-arrow">
                ›
              </span>

            </button>


            {/* =========================
                CANCEL
            ========================= */}

            <button
              className="photo-cancel"
              onClick={closePhotoOptions}
            >
              CANCEL
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          CAMERA POPUP
      ================================================= */}

      {showCamera && (

        <div className="camera-overlay">

          <div className="camera-popup">

            {/* Camera header */}

            <div className="camera-header">

              <h2>
                TAKE PHOTO
              </h2>

              <button
                className="camera-close"
                onClick={closeCamera}
              >
                ×
              </button>

            </div>


            {/* Camera preview */}

            <div className="camera-preview-wrapper">

              {cameraError ? (

                <div className="camera-error">

                  <div className="camera-error-icon">
                    📷
                  </div>

                  <p>
                    {cameraError}
                  </p>

                  <small>
                    Check your browser's camera permission.
                  </small>

                </div>

              ) : (

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-video"
                />

              )}

            </div>


            {/* Hidden canvas used for capturing */}

            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />


            {/* Capture button */}

            <button
              className="capture-button"
              onClick={capturePhoto}
              disabled={!!cameraError}
            >
              ● CAPTURE PHOTO
            </button>


            {/* Cancel */}

            <button
              className="camera-cancel"
              onClick={closeCamera}
            >
              CANCEL
            </button>

          </div>

        </div>

      )}

    </main>
  )
}

export default ScanPage