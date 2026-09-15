
import os
import joblib

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    PROJECT_DIR,
    "best_model.joblib"
)

model = joblib.load(MODEL_PATH)

# Threshold used in the dissertation results
THRESHOLD = 0.4248


def predict_risk(X):

    probability = float(
        model.predict_proba(X)[0][1]
    )

    classification = (
        "Elevated predicted risk"
        if probability >= THRESHOLD
        else "Lower predicted risk"
    )

    return {
        "probability": round(probability, 6),
        "percentage": round(probability * 100, 2),
        "threshold": THRESHOLD,
        "classification": classification
    }