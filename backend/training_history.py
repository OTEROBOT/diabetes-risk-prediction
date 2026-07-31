from flask import Blueprint, jsonify
from database import get_db
#training_history.py
training_history_api = Blueprint(
    "training_history_api",
    __name__
)


@training_history_api.route("/training_history")
def training_history():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            algorithm,
            train_ratio,
            smote,
            accuracy,
            precision,
            recall,
            f1,
            auc,
            cv_accuracy,
            created_at
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
            "smote": bool(row["smote"]) if row["smote"] is not None else False,

            "accuracy": round(row["accuracy"], 4) if row["accuracy"] is not None else None,
            "precision": round(row["precision"], 4) if row["precision"] is not None else None,
            "recall": round(row["recall"], 4) if row["recall"] is not None else None,
            "f1": round(row["f1"], 4) if row["f1"] is not None else None,
            "auc": round(row["auc"], 4) if row["auc"] is not None else None,
            "cv_accuracy": round(row["cv_accuracy"], 4) if row["cv_accuracy"] is not None else None,

            "created_at": row["created_at"]
        })

    return jsonify(result)