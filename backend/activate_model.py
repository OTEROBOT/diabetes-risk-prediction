from flask import Blueprint, jsonify
from database import get_db

activate_model_api = Blueprint(
    "activate_model_api",
    __name__
)


@activate_model_api.route(
    "/activate_model/<int:model_id>",
    methods=["PUT"]
)
def activate_model(model_id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""

    UPDATE models
    SET is_active=0

    """)

    cursor.execute("""

    UPDATE models
    SET is_active=1
    WHERE id=?

    """,(model_id,))

    conn.commit()

    conn.close()

    return jsonify({

        "message":"Model Activated"

    })