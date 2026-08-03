# backend/users_api.py

from flask import Blueprint, request, jsonify
import sqlite3
import os
import bcrypt

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
        WHERE id = ?
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
    data = request.get_json() or {}

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

    # เช็ค email ซ้ำ
    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    )

    if cursor.fetchone():
        conn.close()
        return jsonify({
            "success": False,
            "message": "Email already exists"
        }), 400

    hashed = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    try:
        cursor.execute("""
            INSERT INTO users (
                username,
                email,
                password,
                role
            )
            VALUES (?, ?, ?, ?)
        """, (
            username,
            email,
            hashed,
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
    data = request.get_json() or {}

    username = data.get("username")
    email = data.get("email")
    role = data.get("role")
    password = data.get("password")

    if not username or not email or not role:
        return jsonify({
            "success": False,
            "message": "Username, Email and Role are required"
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE id = ?", (id,))
    row = cursor.fetchone()

    if row is None:
        conn.close()
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    try:
        if password:
            hashed = bcrypt.hashpw(
                password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

            cursor.execute("""
                UPDATE users
                SET
                    username = ?,
                    email = ?,
                    role = ?,
                    password = ?
                WHERE id = ?
            """, (
                username,
                email,
                role,
                hashed,
                id
            ))
        else:
            cursor.execute("""
                UPDATE users
                SET
                    username = ?,
                    email = ?,
                    role = ?
                WHERE id = ?
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

    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({
            "success": False,
            "message": "Email already exists"
        }), 400


# ==========================
# DELETE USER
# ==========================
@users_bp.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE id = ?", (id,))
    row = cursor.fetchone()

    if row is None:
        conn.close()
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    cursor.execute("DELETE FROM users WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "User deleted successfully"
    })