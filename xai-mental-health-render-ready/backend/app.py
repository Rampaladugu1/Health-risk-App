
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from preprocessing import (
    prepare_input,
    validate_input
)

from predict import predict_risk

from explain import explain_with_shap


app = Flask(__name__)

CORS(app, origins=os.getenv("FRONTEND_URL", "*").split(","))


@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "application": "Mental Health XAI Risk Assessment Prototype",
        "status": "running",
        "primary_model": "Logistic Regression",
        "xai_model": "XGBoost",
        "xai_method": "SHAP",
        "processed_features": 69,
        "decision_support_only": True,
        "diagnosis": False
    })


@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "healthy",
        "model": "loaded",
        "preprocessor": "loaded",
        "xai": "available"
    })


@app.route("/assessment", methods=["POST"])
def assessment():

    try:

        data = request.get_json(silent=True)

        if data is None:

            return jsonify({
                "success": False,
                "error": "JSON input is required."
            }), 400


        # Check all 19 required raw variables
        validate_input(data)


        # Raw NHANES variables
        # → saved preprocessing
        # → 69 features

        X = prepare_input(data)


        # Primary dissertation model
        prediction = predict_risk(X)


        # XAI explanation
        explanations = explain_with_shap(X)


        return jsonify({

            "success": True,

            "assessment": {
                "model": "Logistic Regression",
                "probability": prediction["probability"],
                "percentage": prediction["percentage"],
                "threshold": prediction["threshold"],
                "classification": prediction["classification"]
            },

            "explanation": {
                "model": "XGBoost",
                "method": "SHAP",
                "top_features": explanations[:10]
            },

            "human_oversight": True,

            "clinical_decision_support": True,

            "diagnosis": False,

            "disclaimer":
                "This is a research prototype for decision support. "
                "It does not diagnose depression and must not replace "
                "professional clinical judgement."
        })


    except ValueError as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 400


    except Exception as error:

        app.logger.exception("Assessment error")

        return jsonify({
            "success": False,
            "error": "Assessment failed."
        }), 500


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )