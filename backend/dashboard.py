from flask import Blueprint, jsonify
from database import get_db

dashboard_api = Blueprint("dashboard_api", __name__)


@dashboard_api.route("/dashboard")
def dashboard():

    conn = get_db()
    cursor = conn.cursor()

    # จำนวน User
    cursor.execute("SELECT COUNT(*) FROM users")
    users = cursor.fetchone()[0]

    # จำนวน Dataset
    cursor.execute("SELECT COUNT(*) FROM datasets")
    datasets = cursor.fetchone()[0]

    # จำนวน Model
    cursor.execute("SELECT COUNT(*) FROM models")
    models = cursor.fetchone()[0]

    # จำนวน Prediction
    cursor.execute("SELECT COUNT(*) FROM prediction_history")
    predictions = cursor.fetchone()[0]

    conn.close()

    return jsonify({

        "users": users,

        "datasets": datasets,

        "models": models,

        "predictions": predictions

    })