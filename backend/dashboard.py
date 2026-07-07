from flask import Blueprint, jsonify
from database import get_db
import os

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
    
    
@dashboard_api.route("/models/<int:model_id>", methods=["DELETE"])
def delete_model(model_id):

            conn = get_db()
            cursor = conn.cursor()

            cursor.execute(
                "SELECT filepath FROM models WHERE id=?",
                (model_id,)
            )

            model = cursor.fetchone()

            if not model:
                conn.close()
                return jsonify({
                    "message": "Model not found"
                }),404

            filepath = model["filepath"]

            if os.path.exists(filepath):
                os.remove(filepath)

            cursor.execute(
                "DELETE FROM models WHERE id=?",
                (model_id,)
            )

            conn.commit()
            conn.close()

            return jsonify({
                "message":"Model deleted successfully"
            })
            