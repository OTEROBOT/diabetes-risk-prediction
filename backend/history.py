from flask import Blueprint, jsonify
from database import get_db
import json
#history.py
history_api = Blueprint("history_api", __name__)


@history_api.route("/prediction_history")
def prediction_history():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            user_id,
            model_name,
            prediction,
            risk,
            input_json,
            created_at
        FROM prediction_history
        ORDER BY created_at DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    result = []

    for row in rows:
        input_data = None
        if row["input_json"]:
            try:
                input_data = json.loads(row["input_json"])
            except:
                input_data = row["input_json"]

        result.append({
            "id": row["id"],
            "user_id": row["user_id"],
            "model_name": row["model_name"],
            "prediction": row["prediction"],
            "risk": round(row["risk"], 2) if row["risk"] is not None else None,
            "input_json": input_data,
            "created_at": row["created_at"]
        })

    return jsonify(result)


@history_api.route("/prediction_history/<int:id>", methods=["DELETE"])
def delete_prediction(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM prediction_history WHERE id = ?", (id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"message": "Prediction not found"}), 404

    cursor.execute("DELETE FROM prediction_history WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Prediction deleted successfully"})