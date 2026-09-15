# XAI Mental Health Risk Assessment — GitHub + Render

This project is reconstructed from `chow (1).ipynb` and arranged for a split Render deployment: React/Vite frontend + Flask API backend. The notebook remains in `notebooks/chow.ipynb`.

## Render

### Backend Web Service
- Root Directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `gunicorn app:app`
- Environment: `FRONTEND_URL=https://YOUR-FRONTEND.onrender.com`

### Frontend Static Site
- Root Directory: `frontend`
- Build: `npm install && npm run build`
- Publish Directory: `dist`
- Environment: `VITE_API_URL=https://YOUR-BACKEND.onrender.com`

`render.yaml` is included as a blueprint option.

## Important

The notebook does not contain the serialized model binaries as file attachments. The API therefore requires `preprocessor.joblib`, `best_model.joblib`, `xgboost_model.joblib`, and `processed_feature_names.csv` in `backend/` before prediction will work.

The application is a research/clinical decision-support prototype and is not a diagnostic system.
