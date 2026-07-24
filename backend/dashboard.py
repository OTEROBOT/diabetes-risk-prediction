from flask import Blueprint, jsonify
from database import get_db

dashboard_api = Blueprint("dashboard_api", __name__)


@dashboard_api.route("/dashboard")
def dashboard():

    conn = get_db()
    cursor = conn.cursor()

    # ==========================
    # จำนวนผู้ใช้งาน
    # ==========================
    cursor.execute("SELECT COUNT(*) FROM users")
    users = cursor.fetchone()[0]

    # ==========================
    # จำนวน Dataset
    # ==========================
    cursor.execute("SELECT COUNT(*) FROM datasets")
    datasets = cursor.fetchone()[0]

    # ==========================
    # จำนวน Model
    # ==========================
    cursor.execute("SELECT COUNT(*) FROM models")
    models = cursor.fetchone()[0]

    # ==========================
    # จำนวน Prediction
    # ==========================
    cursor.execute("SELECT COUNT(*) FROM prediction_history")
    predictions = cursor.fetchone()[0]

    # ==========================
    # Active Model
    # ==========================
    cursor.execute("""
        SELECT
            model_name,
            accuracy,
            auc
        FROM models
        WHERE is_active = 1
        LIMIT 1
    """)

    active = cursor.fetchone()

    conn.close()

    return jsonify({

        "users": users,

        "datasets": datasets,

        "models": models,

        "predictions": predictions,

        "active_model":
            active["model_name"] if active else None,

        "accuracy":
            active["accuracy"] if active else None,

        "auc":
            active["auc"] if active else None

    })