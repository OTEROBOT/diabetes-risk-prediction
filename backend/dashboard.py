from flask import Blueprint, jsonify
from database import get_db

dashboard_api = Blueprint("dashboard_api", __name__)


@dashboard_api.route("/dashboard")
def dashboard():
    conn = get_db()
    cursor = conn.cursor()

    # 1. รวบ Count ทั้งหมดไว้ใน Query เดียวเพื่อความเร็ว
    cursor.execute("""
        SELECT 
            (SELECT COUNT(*) FROM users) as users,
            (SELECT COUNT(*) FROM datasets) as datasets,
            (SELECT COUNT(*) FROM models) as models,
            (SELECT COUNT(*) FROM prediction_history) as predictions
    """)
    counts = cursor.fetchone()

    # 2. ดึงข้อมูล Active Model
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

    # 3. ส่งค่า Return กลับไปให้ถูกตำแหน่ง
    return jsonify({
        "users": counts["users"] if counts else 0,
        "datasets": counts["datasets"] if counts else 0,
        "models": counts["models"] if counts else 0,
        "predictions": counts["predictions"] if counts else 0,
        "active_model": active["model_name"] if active else None,
        "accuracy": active["accuracy"] if active else None,
        "auc": active["auc"] if active else None
    })


@dashboard_api.route("/dashboard_chart")
def dashboard_chart():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            model_name,
            MAX(accuracy) AS accuracy
        FROM models
        GROUP BY model_name
        ORDER BY accuracy DESC
    """)
    rows = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])