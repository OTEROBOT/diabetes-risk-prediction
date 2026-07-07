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

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth)
app.register_blueprint(upload_api)
app.register_blueprint(train_api)
app.register_blueprint(dashboard_api)

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(
    BASE_DIR / "ml" / "models" / "diabetes_model.pkl"
)

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

    prediction = int(model.predict(sample)[0])

    probability = float(
        model.predict_proba(sample)[0][1]
    )

    return jsonify({

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