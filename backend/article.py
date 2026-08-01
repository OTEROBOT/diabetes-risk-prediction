from flask import Blueprint, request, jsonify
import sqlite3
import os
#D:\IT29401 โครงงานทางเทคโนโลยีสารสนเทศ\ปี4เทอม1\diabetes-risk-prediction\backend\article.py
article_bp = Blueprint("article", __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "diabetes.db")


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# ==========================
# GET ALL ARTICLES
# ==========================
@article_bp.route("/articles", methods=["GET"])
def get_articles():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM articles
        ORDER BY created_at DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])


# ==========================
# GET ARTICLE BY ID
# ==========================
@article_bp.route("/article/<int:id>", methods=["GET"])
def get_article(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM articles
        WHERE id=?
    """, (id,))

    row = cursor.fetchone()
    conn.close()

    if row is None:
        return jsonify({
            "success": False,
            "message": "Article not found"
        }), 404

    return jsonify(dict(row))


# ==========================
# CREATE ARTICLE
# ==========================
@article_bp.route("/article", methods=["POST"])
def create_article():
    data = request.get_json()

    title = data.get("title")
    content = data.get("content")
    image = data.get("image", "")

    if not title or not content:
        return jsonify({
            "success": False,
            "message": "Title and content are required"
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO articles
        (
            title,
            content,
            image
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
    """, (
        title,
        content,
        image
    ))

    conn.commit()

    article_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "success": True,
        "message": "Article created successfully",
        "id": article_id
    })


# ==========================
# UPDATE ARTICLE
# ==========================
@article_bp.route("/article/<int:id>", methods=["PUT"])
def update_article(id):

    data = request.get_json()

    title = data.get("title")
    content = data.get("content")
    image = data.get("image", "")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE articles
        SET
            title=?,
            content=?,
            image=?
        WHERE id=?
    """, (
        title,
        content,
        image,
        id
    ))

    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({
            "success": False,
            "message": "Article not found"
        }), 404

    conn.close()

    return jsonify({
        "success": True,
        "message": "Article updated successfully"
    })


# ==========================
# DELETE ARTICLE
# ==========================
@article_bp.route("/article/<int:id>", methods=["DELETE"])
def delete_article(id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM articles
        WHERE id=?
    """, (id,))

    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({
            "success": False,
            "message": "Article not found"
        }), 404

    conn.close()

    return jsonify({
        "success": True,
        "message": "Article deleted successfully"
    })