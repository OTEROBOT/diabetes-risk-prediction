from flask import Blueprint, jsonify
from database import get_db
from datetime import datetime, date

dashboard_api = Blueprint("dashboard_api", __name__)


@dashboard_api.route("/dashboard")
def dashboard():
    conn = get_db()
    cursor = conn.cursor()

    # 1. นับจำนวนพื้นฐาน
    cursor.execute("""
        SELECT 
            (SELECT COUNT(*) FROM users) as users,
            (SELECT COUNT(*) FROM datasets) as datasets,
            (SELECT COUNT(*) FROM models) as models,
            (SELECT COUNT(*) FROM prediction_history) as predictions
    """)
    counts = cursor.fetchone()

    # 2. Active Model
    cursor.execute("""
        SELECT model_name, accuracy, auc
        FROM models
        WHERE is_active = 1
        LIMIT 1
    """)
    active = cursor.fetchone()

    # 3. Best Model (accuracy สูงสุด)
    cursor.execute("""
        SELECT model_name, accuracy
        FROM models
        ORDER BY accuracy DESC
        LIMIT 1
    """)
    best = cursor.fetchone()

    # 4. Prediction Today
    today = date.today().isoformat()
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM prediction_history
        WHERE DATE(created_at) = ?
    """, (today,))
    today_count = cursor.fetchone()

    # 5. High Risk / Low Risk
    cursor.execute("""
        SELECT 
            SUM(CASE WHEN prediction = 1 THEN 1 ELSE 0 END) as high_risk,
            SUM(CASE WHEN prediction = 0 THEN 1 ELSE 0 END) as low_risk
        FROM prediction_history
    """)
    risk = cursor.fetchone()

    # 6. Recent Predictions (5 รายการล่าสุด)
    cursor.execute("""
        SELECT 
            id,
            prediction,
            risk,
            model_name,
            created_at
        FROM prediction_history
        ORDER BY created_at DESC
        LIMIT 5
    """)
    recent = cursor.fetchall()

    # 7. Model Accuracies (สำหรับกราฟ)
    cursor.execute("""
        SELECT 
            model_name as name,
            MAX(accuracy) as accuracy
        FROM models
        GROUP BY model_name
        ORDER BY accuracy DESC
    """)
    model_acc = cursor.fetchall()

    conn.close()

    return jsonify({
        "users": counts["users"] if counts else 0,
        "datasets": counts["datasets"] if counts else 0,
        "models": counts["models"] if counts else 0,
        "predictions": counts["predictions"] if counts else 0,
        
        "active_model": active["model_name"] if active else None,
        "accuracy": active["accuracy"] if active else None,
        "auc": active["auc"] if active else None,

        "best_model": best["model_name"] if best else None,
        "prediction_today": today_count["count"] if today_count else 0,
        
        "high_risk": risk["high_risk"] if risk and risk["high_risk"] else 0,
        "low_risk": risk["low_risk"] if risk and risk["low_risk"] else 0,

        "recent_predictions": [
            {
                "id": row["id"],
                "prediction": row["prediction"],
                "risk": row["risk"],
                "model_name": row["model_name"],
                "created_at": row["created_at"]
            }
            for row in recent
        ] if recent else [],

        "model_accuracies": [
            {
                "name": row["name"],
                "accuracy": row["accuracy"]
            }
            for row in model_acc
        ] if model_acc else []
    })