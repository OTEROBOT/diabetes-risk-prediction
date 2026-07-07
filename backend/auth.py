from flask import Blueprint, request, jsonify
from database import get_db
import bcrypt
import jwt
import datetime
from functools import wraps

auth = Blueprint("auth", __name__)

SECRET_KEY = "DIABETES_PROJECT_SECRET_2026"


# =========================
# Register
# =========================

@auth.route("/register", methods=["POST"])
def register():

    data = request.json

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({
            "message": "กรอกข้อมูลไม่ครบ"
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    )

    if cursor.fetchone():
        conn.close()
        return jsonify({
            "message": "Email นี้ถูกใช้งานแล้ว"
        }), 400

    hashed = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    )

    cursor.execute("""
        INSERT INTO users(username,email,password)
        VALUES(?,?,?)
    """, (
        username,
        email,
        hashed.decode()
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Register Success"
    })


# =========================
# Login
# =========================

@auth.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    )

    user = cursor.fetchone()

    conn.close()

    if not user:
        return jsonify({
            "message": "ไม่พบผู้ใช้"
        }), 401

    if not bcrypt.checkpw(
        password.encode(),
        user["password"].encode()
    ):
        return jsonify({
            "message": "รหัสผ่านไม่ถูกต้อง"
        }), 401

    token = jwt.encode({

        "id": user["id"],
        "email": user["email"],
        "role": user["role"],

        "exp": datetime.datetime.utcnow()
        + datetime.timedelta(days=7)

    }, SECRET_KEY, algorithm="HS256")

    return jsonify({

        "message": "Login Success",

        "token": token,

        "user": {

            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]

        }

    })


# =========================
# JWT Middleware
# =========================

def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.headers.get("Authorization")

        if not token:
            return jsonify({
                "message": "Token is missing"
            }), 401

        try:

            token = token.split(" ")[1]

            data = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )

        except Exception:
            return jsonify({
                "message": "Invalid Token"
            }), 401

        return f(data, *args, **kwargs)

    return decorated