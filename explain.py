
import os
import joblib
import numpy as np
import pandas as pd
import shap

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    PROJECT_DIR,
    "xgboost_model.joblib"
)

FEATURE_PATH = os.path.join(
    PROJECT_DIR,
    "processed_feature_names.csv"
)

model = joblib.load(MODEL_PATH)

feature_table = pd.read_csv(FEATURE_PATH)

FEATURE_NAMES = (
    feature_table["Feature"]
    .astype(str)
    .tolist()
)


def explain_with_shap(X):

    explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(X)

    shap_values = np.asarray(shap_values)

    if shap_values.ndim == 3:
        shap_values = shap_values[0, :, 1]

    elif shap_values.ndim == 2:
        shap_values = shap_values[0]

    else:
        shap_values = shap_values.flatten()

    results = []

    for feature, value in zip(
        FEATURE_NAMES,
        shap_values
    ):

        value = float(value)

        results.append({
            "feature": feature,
            "contribution": round(value, 6),
            "direction": (
                "increases predicted risk"
                if value > 0
                else "decreases predicted risk"
            )
        })

    results.sort(
        key=lambda x: abs(x["contribution"]),
        reverse=True
    )

    return results