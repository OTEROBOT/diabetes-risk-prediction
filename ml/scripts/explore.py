import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
csv_path = BASE_DIR.parent / "dataset" / "diabetes_012_health_indicators_BRFSS2015.csv"

df = pd.read_csv(csv_path)

print("="*50)
print("Shape")
print(df.shape)

print("="*50)
print("Columns")
print(df.columns)

print("="*50)
print("Info")
print(df.info())

print("="*50)
print("Missing Value")
print(df.isnull().sum())

print("="*50)
print("Describe")
print(df.describe())