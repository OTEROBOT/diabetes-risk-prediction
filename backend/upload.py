from flask import Blueprint, request, jsonify
from database import get_db
import pandas as pd
import os
from flask import send_file

upload_api = Blueprint("upload_api", __name__)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@upload_api.route("/upload_dataset", methods=["POST"])
def upload_dataset():

    print("FILES =", request.files)
    print("FORM =", request.form)
    print("CONTENT TYPE =", request.content_type)

    if "file" not in request.files:

        return jsonify({
            "message": "No file"
        }), 400

    file = request.files["file"]

    if file.filename == "":

        return jsonify({
            "message": "No selected file"
        }), 400

    filename = file.filename

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(filepath)

    if filename.endswith(".csv"):

        df = pd.read_csv(filepath)

    elif filename.endswith(".xlsx"):

        df = pd.read_excel(filepath)

    else:

        return jsonify({
            "message": "File type not supported"
        }), 400

    rows = len(df)
    columns = len(df.columns)

    conn = get_db()

    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT id FROM datasets WHERE filename=?",
        (filename,)
    )

    exists = cursor.fetchone()

    if exists:

        conn.close()

        return jsonify({

            "message": "Dataset already exists"

        }),400

    cursor.execute("""

        INSERT INTO datasets
        (
            filename,
            filepath,
            rows,
            columns
        )

        VALUES
        (
            ?, ?, ?, ?
        )

        """, (

            filename,
            filepath,
            rows,
            columns

        ))

    conn.commit()

    conn.close()

    return jsonify({

        "message":"Upload Success",

        "filename":filename,

        "rows":rows,

        "columns":columns

    })
    
    
    
    # ==========================
# GET DATASETS
# ==========================

@upload_api.route("/datasets", methods=["GET"])
def get_datasets():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            filename,
            rows,
            columns
        FROM datasets
        ORDER BY id DESC
    """)

    datasets = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in datasets])



# ==========================
# DELETE DATASET
# ==========================

@upload_api.route("/datasets/<int:dataset_id>", methods=["DELETE"])
def delete_dataset(dataset_id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT filepath FROM datasets WHERE id=?",
        (dataset_id,)
    )

    dataset = cursor.fetchone()

    if dataset is None:
        conn.close()
        return jsonify({
            "message": "Dataset not found"
        }), 404

    filepath = dataset["filepath"]

    if os.path.exists(filepath):
        os.remove(filepath)

    cursor.execute(
        "DELETE FROM datasets WHERE id=?",
        (dataset_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Dataset deleted successfully"
    })
    
    
    
    
    
@upload_api.route("/download_dataset/<int:dataset_id>")
def download_dataset(dataset_id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT filename, filepath FROM datasets WHERE id=?",
        (dataset_id,)
    )

    dataset = cursor.fetchone()

    conn.close()

    if not dataset:
        return jsonify({"message": "Dataset not found"}),404

    return send_file(
        dataset["filepath"],
        as_attachment=True,
        download_name=dataset["filename"]
    )