import numpy as np

from sklearn.metrics import (
    confusion_matrix,
    roc_auc_score
)


def calculate_group_metrics(
    y_true,
    y_probability,
    threshold=0.5
):

    y_true = np.asarray(y_true)
    y_probability = np.asarray(y_probability)

    y_pred = (
        y_probability >= threshold
    ).astype(int)

    tn, fp, fn, tp = confusion_matrix(
        y_true,
        y_pred,
        labels=[0, 1]
    ).ravel()

    sensitivity = (
        tp / (tp + fn)
        if (tp + fn) > 0
        else np.nan
    )

    specificity = (
        tn / (tn + fp)
        if (tn + fp) > 0
        else np.nan
    )

    fpr = (
        fp / (fp + tn)
        if (fp + tn) > 0
        else np.nan
    )

    fnr = (
        fn / (fn + tp)
        if (fn + tp) > 0
        else np.nan
    )

    ppv = (
        tp / (tp + fp)
        if (tp + fp) > 0
        else np.nan
    )

    npv = (
        tn / (tn + fn)
        if (tn + fn) > 0
        else np.nan
    )

    try:
        auc = roc_auc_score(
            y_true,
            y_probability
        )
    except ValueError:
        auc = np.nan

    selection_rate = np.mean(y_pred)

    mean_predicted_risk = np.mean(
        y_probability
    )

    return {
        "sensitivity": float(sensitivity)
            if not np.isnan(sensitivity)
            else None,

        "specificity": float(specificity)
            if not np.isnan(specificity)
            else None,

        "fpr": float(fpr)
            if not np.isnan(fpr)
            else None,

        "fnr": float(fnr)
            if not np.isnan(fnr)
            else None,

        "ppv": float(ppv)
            if not np.isnan(ppv)
            else None,

        "npv": float(npv)
            if not np.isnan(npv)
            else None,

        "auc": float(auc)
            if not np.isnan(auc)
            else None,

        "selection_rate":
            float(selection_rate),

        "mean_predicted_risk":
            float(mean_predicted_risk),

        "n": int(len(y_true)),

        "positive_cases":
            int(np.sum(y_true == 1))
    }