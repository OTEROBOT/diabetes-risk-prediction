from flask import Blueprint, jsonify
from database import get_db
import os

delete_model_api = Blueprint(
    "delete_model_api",
    __name__
)


@delete_model_api.route("/delete_model/<int:model_id>", methods=["DELETE"])
def delete_model(model_id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT filepath FROM models WHERE id=?",
        (model_id,)
    )

    row = cursor.fetchone()

    if row is None:

        conn.close()

        return jsonify({
            "message": "Model not found"
        }),404

    filepath = row["filepath"]

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