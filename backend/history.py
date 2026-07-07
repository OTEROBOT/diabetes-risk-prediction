from flask import Blueprint, jsonify
from database import get_db

history_api = Blueprint("history_api", __name__)

@history_api.route("/prediction_history")
def prediction_history():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT *
    FROM prediction_history
    ORDER BY created_at DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    result = []

    for row in rows:
        result.append({
            "id": row["id"],
            "user_id": row["user_id"],
            "prediction": row["prediction"],
            "risk": round(row["risk"], 2),
            "created_at": row["created_at"]
        })

    return jsonify(result)