
import os
import joblib
import pandas as pd


PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

PREPROCESSOR_PATH = os.path.join(
    PROJECT_DIR,
    "preprocessor.joblib"
)

# Load the EXACT preprocessing pipeline used during model training
preprocessor = joblib.load(PREPROCESSOR_PATH)


def get_required_columns():
    """
    Return the exact raw variables expected by the saved
    dissertation preprocessing pipeline.
    """

    columns = []

    for _, _, transformer_columns in preprocessor.transformers_:
        columns.extend(list(transformer_columns))

    return columns


def validate_input(data):
    """
    Validate incoming assessment data.

    This performs API-level validation while ensuring that
    all variables required by the saved training pipeline
    are present.
    """

    if not isinstance(data, dict):
        raise ValueError(
            "Input must be a JSON object."
        )

    # --------------------------------------------------
    # Check the exact variables required by the model
    # --------------------------------------------------

    required_columns = get_required_columns()

    missing = [
        column
        for column in required_columns
        if column not in data
    ]

    if missing:
        raise ValueError(
            "Missing required variables: "
            + ", ".join(missing)
        )

    # --------------------------------------------------
    # Basic validation of selected numerical variables
    # --------------------------------------------------

    try:
        age = float(data["RIDAGEYR"])
        bmi = float(data["BMXBMI"])
        sleep_weekday = float(data["SLD012"])
        sleep_weekend = float(data["SLD013"])
    except (TypeError, ValueError):
        raise ValueError(
            "Age, BMI and sleep variables must be numeric."
        )

    if age < 18 or age > 120:
        raise ValueError(
            "Age must be between 18 and 120."
        )

    if bmi <= 0 or bmi > 100:
        raise ValueError(
            "BMI value is outside the permitted range."
        )

    if sleep_weekday < 0 or sleep_weekday > 24:
        raise ValueError(
            "Weekday sleep duration must be between 0 and 24 hours."
        )

    if sleep_weekend < 0 or sleep_weekend > 24:
        raise ValueError(
            "Weekend sleep duration must be between 0 and 24 hours."
        )

    return True


def prepare_input(data):
    """
    Convert raw assessment input into the exact 69-feature
    representation expected by the trained model.

    The saved preprocessing pipeline is used directly.
    No alternative encoding or fallback preprocessing is used.
    """

    validate_input(data)

    required_columns = get_required_columns()

    df = pd.DataFrame(
        [data],
        columns=required_columns
    )

    return preprocessor.transform(df)