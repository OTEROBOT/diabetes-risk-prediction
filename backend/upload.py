from flask import Blueprint, request, jsonify
from database import get_db
import pandas as pd
import os

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

    cursor.execute("""

        INSERT INTO datasets

        (filename,rows,columns)

        VALUES

        (?,?,?)

    """, (

        filename,
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