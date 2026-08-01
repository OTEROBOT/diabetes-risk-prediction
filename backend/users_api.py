from flask import Blueprint, request, jsonify
import sqlite3
import os
#D:\IT29401 โครงงานทางเทคโนโลยีสารสนเทศ\ปี4เทอม1\diabetes-risk-prediction\backend\users_api.py
users_bp = Blueprint("users", __name__)

DATABASE = os.path.join(os.path.dirname(__file__), "diabetes.db")


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# ==========================
# GET ALL USERS
# ==========================
@users_bp.route("/users", methods=["GET"])
def get_users():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            username,
            email,
            role,
            created_at
        FROM users
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])


# ==========================
# GET USER BY ID
# ==========================
@users_bp.route("/users/<int:id>", methods=["GET"])
def get_user(id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            username,
            email,
            role,
            created_at
        FROM users
        WHERE id=?
    """, (id,))

    row = cursor.fetchone()
    conn.close()

    if row is None:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    return jsonify(dict(row))


# ==========================
# CREATE USER
# ==========================
@users_bp.route("/users", methods=["POST"])
def create_user():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if not username or not email or not password:
        return jsonify({
            "success": False,
            "message": "Username, Email and Password are required"
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    try:

        cursor.execute("""
            INSERT INTO users
            (
                username,
                email,
                password,
                role
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?
            )
        """, (
            username,
            email,
            password,
            role
        ))

        conn.commit()

        user_id = cursor.lastrowid

        conn.close()

        return jsonify({
            "success": True,
            "message": "User created successfully",
            "id": user_id
        })

    except sqlite3.IntegrityError:

        conn.close()

        return jsonify({
            "success": False,
            "message": "Email already exists"
        }), 400


# ==========================
# UPDATE USER
# ==========================
@users_bp.route("/users/<int:id>", methods=["PUT"])
def update_user(id):

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    role = data.get("role")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET
            username=?,
            email=?,
            role=?
        WHERE id=?
    """, (
        username,
        email,
        role,
        id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "User updated successfully"
    })


# ==========================
# DELETE USER
# ==========================
@users_bp.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM users
        WHERE id=?
    """, (id,))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "User deleted successfully"
    })