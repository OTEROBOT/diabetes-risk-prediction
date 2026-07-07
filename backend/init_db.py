import sqlite3

conn = sqlite3.connect("diabetes.db")
cursor = conn.cursor()

# ==========================================
# USERS
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# ==========================================
# DATASETS
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS datasets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    rows INTEGER,
    columns INTEGER,
    uploaded_by INTEGER,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(uploaded_by) REFERENCES users(id)
)
""")

# ==========================================
# MODELS
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS models(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_name TEXT NOT NULL,
    algorithm TEXT,
    accuracy REAL,
    precision REAL,
    recall REAL,
    f1 REAL,
    auc REAL,
    filepath TEXT,
    is_active INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# ==========================================
# TRAINING HISTORY
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS training_history(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER,
    model_id INTEGER,
    algorithm TEXT,
    train_ratio REAL,
    test_ratio REAL,
    smote INTEGER,
    accuracy REAL,
    precision REAL,
    recall REAL,
    f1 REAL,
    auc REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(dataset_id) REFERENCES datasets(id),
    FOREIGN KEY(model_id) REFERENCES models(id)
)
""")

# ==========================================
# PREDICTION HISTORY
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS prediction_history(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    prediction INTEGER,
    risk REAL,
    input_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
""")

conn.commit()
conn.close()

print("========================================")
print("Database Created Successfully")
print("========================================")