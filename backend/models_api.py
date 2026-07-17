from flask import Blueprint, jsonify
from database import get_db

models_api = Blueprint(
    "models_api",
    __name__
)


@models_api.route("/models")
def models():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""

    SELECT *

    FROM models

    ORDER BY id DESC

    """)

    rows = cursor.fetchall()

    conn.close()

    result = []

    for row in rows:

        result.append({

            "id": row["id"],

            "model_name": row["model_name"],

            "accuracy": round(row["accuracy"],4),

            "precision": round(row["precision"],4),

            "recall": round(row["recall"],4),

            "f1": round(row["f1"],4),

            "auc": round(row["auc"],4),

            "cv_accuracy": (
                round(row["cv_accuracy"],4)
                if row["cv_accuracy"] is not None
                else None
            ),

            "filepath": row["filepath"]

        })

    return jsonify(result)