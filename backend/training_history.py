from flask import Blueprint, jsonify
from database import get_db

training_history_api = Blueprint(
    "training_history_api",
    __name__
)


@training_history_api.route("/training_history")
def training_history():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""

    SELECT *

    FROM training_history

    ORDER BY created_at DESC

    """)

    rows = cursor.fetchall()

    conn.close()

    result = []

    for row in rows:

        result.append({

            "id": row["id"],

            "algorithm": row["algorithm"],

            "train_ratio": row["train_ratio"],

            "smote": bool(row["smote"]),

            "accuracy": round(row["accuracy"],4),

            "precision": round(row["precision"],4),

            "recall": round(row["recall"],4),

            "f1": round(row["f1"],4),

            "auc": round(row["auc"],4),
            
            "cv_accuracy": round(row["cv_accuracy"],4),

            "created_at": row["created_at"]

        })

    return jsonify(result)