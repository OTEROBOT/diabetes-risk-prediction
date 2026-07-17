from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from pathlib import Path

from database import get_db
from auth import auth, token_required
from upload import upload_api
from train import train_api
from dashboard import dashboard_api
from history import history_api
from training_history import training_history_api
from models_api import models_api
from delete_model import delete_model_api
from activate_model import activate_model_api

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth)
app.register_blueprint(upload_api)
app.register_blueprint(train_api)
app.register_blueprint(dashboard_api)
app.register_blueprint(history_api)
app.register_blueprint(training_history_api)
app.register_blueprint(models_api)
app.register_blueprint(delete_model_api)
app.register_blueprint(activate_model_api)

def load_active_model():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT model_name, filepath
        FROM models
        WHERE is_active = 1
        LIMIT 1
    """)

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return None, None

    model = joblib.load(row["filepath"])

    return model, row["model_name"]

FEATURES = [
    "HighBP",
    "BMI",
    "Smoker",
    "PhysActivity",
    "Fruits",
    "Veggies",
    "HvyAlcoholConsump",
    "GenHlth",
    "Sex",
    "Age"
]


# ===========================
# HOME
# ===========================

@app.route("/")
def home():
    return "Diabetes Prediction API is running."


# ===========================
# PREDICT
# ===========================

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    sample = pd.DataFrame([{
        "HighBP": data["HighBP"],
        "BMI": data["BMI"],
        "Smoker": data["Smoker"],
        "PhysActivity": data["PhysActivity"],
        "Fruits": data["Fruits"],
        "Veggies": data["Veggies"],
        "HvyAlcoholConsump": data["HvyAlcoholConsump"],
        "GenHlth": data["GenHlth"],
        "Sex": data["Sex"],
        "Age": data["Age"],
    }])

    model, model_name = load_active_model()

    if model is None:

        return jsonify({
            "message": "No active model"
        }),404

    prediction = int(model.predict(sample)[0])

    probability = float(
        model.predict_proba(sample)[0][1]
    )

    conn = get_db()

    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO prediction_history(
        user_id,
        prediction,
        risk
    )
    VALUES(?,?,?)
    """,(
        None,
        prediction,
        probability * 100
    ))

    conn.commit()

    conn.close()

    return jsonify({

    "model": model_name,

    "prediction": prediction,

    "probability": probability,

    "risk": round(probability * 100, 2)

})


# ===========================
# TEST DATABASE
# ===========================

@app.route("/test_db")
def test_db():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT sqlite_version()"
    )

    version = cursor.fetchone()[0]

    conn.close()

    return jsonify({

        "status": "success",

        "sqlite_version": version

    })


# ===========================
# MAKE ADMIN (ใช้ครั้งเดียว)
# ===========================

@app.route("/make_admin")
def make_admin():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""

        UPDATE users
        SET role='admin'
        WHERE email='admin@gmail.com'

    """)

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Admin Updated Successfully"
    })


# ===========================
# ADMIN PAGE
# ===========================

@app.route("/admin")
@token_required
def admin(user):

    if user["role"] != "admin":

        return jsonify({

            "message": "Permission Denied"

        }), 403

    return jsonify({

        "message": "Welcome Admin",

        "user": user

    })


# ===========================

if __name__ == "__main__":
    app.run(debug=True)