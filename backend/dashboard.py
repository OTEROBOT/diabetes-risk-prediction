from flask import Blueprint, jsonify
from database import get_db
from datetime import date
import json

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
        SELECT 
            model_name, 
            accuracy, 
            precision, 
            recall, 
            f1, 
            auc, 
            cv_accuracy
        FROM models
        WHERE is_active = 1
        LIMIT 1
    """)
    active = cursor.fetchone()

    # 3. Best Model
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

    # 6. Recent Predictions
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

    # 7. Model Accuracies
    cursor.execute("""
        SELECT 
            model_name as name,
            MAX(accuracy) as accuracy
        FROM models
        GROUP BY model_name
        ORDER BY accuracy DESC
    """)
    model_acc = cursor.fetchall()

    # 8. Risk Statistics
    cursor.execute("""
        SELECT
            AVG(risk) as avg_risk,
            MAX(risk) as max_risk,
            MIN(risk) as min_risk
        FROM prediction_history
        WHERE risk IS NOT NULL
    """)
    risk_stats = cursor.fetchone()

    conn.close()

    return jsonify({
        "users": counts["users"] if counts else 0,
        "datasets": counts["datasets"] if counts else 0,
        "models": counts["models"] if counts else 0,
        "predictions": counts["predictions"] if counts else 0,

        "active_model": active["model_name"] if active else None,
        "accuracy": active["accuracy"] if active else None,
        "precision": active["precision"] if active else None,
        "recall": active["recall"] if active else None,
        "f1": active["f1"] if active else None,
        "auc": active["auc"] if active else None,
        "cv_accuracy": active["cv_accuracy"] if active else None,

        "best_model": best["model_name"] if best else None,
        "prediction_today": today_count["count"] if today_count else 0,

        "high_risk": risk["high_risk"] if risk and risk["high_risk"] else 0,
        "low_risk": risk["low_risk"] if risk and risk["low_risk"] else 0,

        "avg_risk": round(risk_stats["avg_risk"], 2) if risk_stats and risk_stats["avg_risk"] is not None else 0,
        "max_risk": round(risk_stats["max_risk"], 2) if risk_stats and risk_stats["max_risk"] is not None else 0,
        "min_risk": round(risk_stats["min_risk"], 2) if risk_stats and risk_stats["min_risk"] is not None else 0,

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


@dashboard_api.route("/prediction_trend")
def prediction_trend():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
        FROM prediction_history
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    """)

    rows = cursor.fetchall()
    conn.close()

    result = [
        {
            "date": row["date"],
            "count": row["count"]
        }
        for row in rows
    ]

    return jsonify(result)


@dashboard_api.route("/model_information")
def model_information():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            model_name,
            algorithm,
            accuracy,
            precision,
            recall,
            f1,
            auc,
            cv_accuracy,
            is_active,
            created_at,
            confusion_matrix
        FROM models
        WHERE is_active = 1
        LIMIT 1
    """)
    active = cursor.fetchone()

    if not active:
        cursor.execute("""
            SELECT
                id,
                model_name,
                algorithm,
                accuracy,
                precision,
                recall,
                f1,
                auc,
                cv_accuracy,
                is_active,
                created_at,
                confusion_matrix
            FROM models
            ORDER BY accuracy DESC
            LIMIT 1
        """)
        active = cursor.fetchone()

    conn.close()

    if not active:
        return jsonify({"message": "No model found"}), 404

    cm = None
    if active["confusion_matrix"]:
        try:
            cm = json.loads(active["confusion_matrix"])
        except:
            cm = None

    return jsonify({
        "id": active["id"],
        "model_name": active["model_name"],
        "algorithm": active["algorithm"] or active["model_name"],
        "accuracy": active["accuracy"],
        "precision": active["precision"],
        "recall": active["recall"],
        "f1": active["f1"],
        "auc": active["auc"],
        "cv_accuracy": active["cv_accuracy"],
        "is_active": bool(active["is_active"]),
        "created_at": active["created_at"],
        "confusion_matrix": cm
    })
    
    