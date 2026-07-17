from flask import Blueprint, request, jsonify

import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

from sklearn.linear_model import LogisticRegression

from sklearn.tree import DecisionTreeClassifier

from sklearn.ensemble import RandomForestClassifier

from sklearn.neighbors import KNeighborsClassifier

from sklearn.svm import SVC

from imblearn.over_sampling import SMOTE

from database import get_db

from sklearn.model_selection import StratifiedKFold

from sklearn.model_selection import cross_val_score

from pathlib import Path

train_api = Blueprint("train_api", __name__)

FEATURES = [

    "HighBP",
    "BMI",
    "Smoker",
    "PhysActivity",
    "Fruits",
    "Veggies",
    "HvyAlcoholConsump",
    "GenHlth",
    "Sex",
    "Age"

]

TARGET = "Diabetes_binary"

@train_api.route("/train_model", methods=["POST"])
def train_model():

    

    data = request.json

    dataset = data["dataset"]
    algorithm = data["algorithm"]
    split = float(data["split"])
    use_smote = data["smote"]

    BASE_DIR = Path(__file__).resolve().parent

    filepath = BASE_DIR / "uploads" / dataset

    df = pd.read_csv(filepath)

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        train_size=split,
        random_state=42,
        stratify=y
    )

    # ใช้ SMOTE ถ้าเลือก
    if use_smote:
        smote = SMOTE(random_state=42)
        X_train, y_train = smote.fit_resample(
            X_train,
            y_train
        )

    # เลือกอัลกอริทึม
    if algorithm == "Random Forest":

        model = RandomForestClassifier(
            random_state=42
        )

    elif algorithm == "Decision Tree":

        model = DecisionTreeClassifier(
            random_state=42
        )

    elif algorithm == "Logistic Regression":

        model = LogisticRegression(
            max_iter=1000
        )

    elif algorithm == "KNN":

        model = KNeighborsClassifier()

    elif algorithm == "SVM":

        model = SVC(
            probability=True
        )

    else:

        return jsonify({
            "message": "Unknown Algorithm"
        }), 400
        
        
    # =====================
    # K-Fold Cross Validation
    # =====================

    kfold = int(data.get("kfold",0))

    cv_accuracy = None

    if kfold > 1:

        skf = StratifiedKFold(
            n_splits=kfold,
            shuffle=True,
            random_state=42
        )

        scores = cross_val_score(
            model,
            X,
            y,
            cv=skf,
            scoring="accuracy"
        )

        cv_accuracy = scores.mean()
        
        

    # Train
    model.fit(
        X_train,
        y_train
    )

    # Predict
    y_pred = model.predict(X_test)

    # Probability
    y_prob = model.predict_proba(X_test)[:, 1]

    # Metrics
    accuracy = accuracy_score(y_test, y_pred)

    precision = precision_score(y_test, y_pred)

    recall = recall_score(y_test, y_pred)

    f1 = f1_score(y_test, y_pred)

    roc = roc_auc_score(y_test, y_prob)
    
    conn = get_db()

    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO training_history(

    algorithm,
    train_ratio,
    smote,
    accuracy,
    precision,
    recall,
    f1,
    auc,
    cv_accuracy

    )
    VALUES(?,?,?,?,?,?,?,?,?)
    """, (
        algorithm,
        split,
        int(use_smote),
        accuracy,
        precision,
        recall,
        f1,
        roc,
        cv_accuracy
    ))

    
    
    

    BASE_DIR = Path(__file__).resolve().parent

    MODELS_DIR = BASE_DIR / "models"

    MODELS_DIR.mkdir(exist_ok=True)

    model_name = algorithm.replace(" ", "_") + ".pkl"

    model_path = MODELS_DIR / model_name

    joblib.dump(
        model,
        model_path
    )

    cursor.execute("""
    INSERT INTO models(
    model_name,
    accuracy,
    precision,
    recall,
    f1,
    auc,
    cv_accuracy,
    filepath
    )
    VALUES(?,?,?,?,?,?,?,?)
    """,(
        algorithm,
        accuracy,
        precision,
        recall,
        f1,
        roc,
        cv_accuracy,
        str(model_path)
    ))
    
    conn.commit()

    conn.close()
    
    return jsonify({

    "algorithm": algorithm,

    "accuracy": round(accuracy,4),

    "precision": round(precision,4),

    "recall": round(recall,4),

    "f1": round(f1,4),

    "roc_auc": round(roc,4),

        "cv_accuracy": (
                round(cv_accuracy,4)
                if cv_accuracy is not None
                else None
        ),

    "model_path": model_path

})