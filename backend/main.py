from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import cv2
import numpy as np
import onnxruntime as ort
from pathlib import Path


# ============================================================
# APP
# ============================================================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# EXISTING AI MODEL
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "resnet18.onnx"

HAIR_CLASS = 17
INPUT_SIZE = 512

print("Loading existing hair-segmentation model...")

session = ort.InferenceSession(
    str(MODEL_PATH),
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name

print("AI MODEL LOADED SUCCESSFULLY")


# ============================================================
# HAIR SEGMENTATION
# ============================================================

def get_hair_mask(image):
    height, width = image.shape[:2]

    # Resize for the AI model
    resized = cv2.resize(
        image,
        (INPUT_SIZE, INPUT_SIZE),
        interpolation=cv2.INTER_LINEAR
    )

    # BGR -> RGB
    rgb = cv2.cvtColor(
        resized,
        cv2.COLOR_BGR2RGB
    )

    # Normalize
    tensor = rgb.astype(np.float32) / 255.0

    mean = np.array(
        [0.485, 0.456, 0.406],
        dtype=np.float32
    )

    std = np.array(
        [0.229, 0.224, 0.225],
        dtype=np.float32
    )

    tensor = (tensor - mean) / std

    # HWC -> CHW
    tensor = np.transpose(
        tensor,
        (2, 0, 1)
    )

    # Add batch dimension
    tensor = np.expand_dims(
        tensor,
        axis=0
    ).astype(np.float32)

    # AI prediction
    output = session.run(
        None,
        {
            input_name: tensor
        }
    )[0]

    # Get predicted class
    prediction = np.argmax(
        output[0],
        axis=0
    ).astype(np.uint8)

    # Hair = class 17
    mask_512 = np.where(
        prediction == HAIR_CLASS,
        255,
        0
    ).astype(np.uint8)

    # Resize mask back to original image
    mask = cv2.resize(
        mask_512,
        (width, height),
        interpolation=cv2.INTER_NEAREST
    )

    # Small cleanup
    kernel = np.ones(
        (3, 3),
        np.uint8
    )

    mask = cv2.morphologyEx(
        mask,
        cv2.MORPH_OPEN,
        kernel
    )

    mask = cv2.morphologyEx(
        mask,
        cv2.MORPH_CLOSE,
        kernel
    )

    return mask


# ============================================================
# HAIR COUNT ESTIMATION
# ============================================================

def estimate_hair_count(image, hair_mask):

    hair_pixels = cv2.countNonZero(hair_mask)

    total_pixels = image.shape[0] * image.shape[1]

    if hair_pixels == 0:
        return 0

    # Hair coverage
    coverage = (
        hair_pixels / total_pixels
    ) * 100

    # Hair texture / edge information
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(gray)

    edges = cv2.Canny(
        enhanced,
        30,
        100
    )

    hair_edges = cv2.bitwise_and(
        edges,
        edges,
        mask=hair_mask
    )

    edge_pixels = cv2.countNonZero(
        hair_edges
    )

    edge_density = (
        edge_pixels / hair_pixels
    ) * 100

    # Existing prototype calibration
    BASE_HAIR_COUNT = 100000
    REFERENCE_COVERAGE = 15.0
    REFERENCE_EDGE_DENSITY = 33.0
    TEXTURE_WEIGHT = 0.30

    coverage_factor = (
        coverage / REFERENCE_COVERAGE
    )

    texture_factor = (
        edge_density / REFERENCE_EDGE_DENSITY
    )

    combined_factor = (
        (1 - TEXTURE_WEIGHT) * coverage_factor
        + TEXTURE_WEIGHT * texture_factor
    )

    estimated_count = int(
        BASE_HAIR_COUNT * combined_factor
    )

    # Keep the fun estimate within a reasonable range
    estimated_count = max(
        20000,
        min(200000, estimated_count)
    )

    return estimated_count


# ============================================================
# SCAN API
# ============================================================

@app.post("/api/scan")
async def scan_hair(image: UploadFile = File(...)):

    try:

        # Read uploaded image
        image_bytes = await image.read()

        # Convert bytes -> OpenCV image
        array = np.frombuffer(
            image_bytes,
            dtype=np.uint8
        )

        img = cv2.imdecode(
            array,
            cv2.IMREAD_COLOR
        )

        if img is None:
            return {
                "hairCount": 0,
                "error": "Could not read image"
            }

        # AI hair segmentation
        hair_mask = get_hair_mask(img)

        # Estimate hair count
        hair_count = estimate_hair_count(
            img,
            hair_mask
        )

        print(
            f"Hair scan complete: {hair_count:,}"
        )

        return {
            "hairCount": hair_count
        }

    except Exception as e:

        print("SCAN ERROR:", e)

        return {
            "hairCount": 0,
            "error": str(e)
        }