# seed.py
import sqlite3
import csv
import os

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_THIS_DIR)
DB_PATH = os.path.join(_THIS_DIR, "supplyshield.db")
SCHEMA_PATH = os.path.join(_THIS_DIR, "schema.sql")
CSV_DIR = os.path.join(_PROJECT_ROOT, "ml", "datasets", "raw")

def seed_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print("Removed existing database file.")
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Read schema
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    cursor.executescript(schema_sql)
    print("Database schema initialized.")
    
    # Tables map: csv_filename -> db_table_name
    tables = {
        "suppliers.csv": "suppliers",
        "financial_history.csv": "financial_history",
        "orders.csv": "orders",
        "delivery_history.csv": "delivery_history",
        "quality_history.csv": "quality_history",
        "complaints.csv": "complaints",
        "compliance.csv": "compliance",
        "external_events.csv": "external_events",
        "predictions.csv": "predictions",
        "recommendations.csv": "recommendations"
    }
    
    for csv_file, table_name in tables.items():
        csv_path = os.path.join(CSV_DIR, csv_file)
        if not os.path.exists(csv_path):
            print(f"Warning: {csv_file} does not exist. Skipping.")
            continue
            
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            columns = reader.fieldnames
            
            # Form insert query
            placeholders = ", ".join(["?"] * len(columns))
            query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
            
            rows_to_insert = []
            for row in reader:
                # convert boolean strings if any to 1 or 0
                val_list = []
                for col in columns:
                    val = row[col]
                    if val.lower() == 'true':
                        val_list.append(1)
                    elif val.lower() == 'false':
                        val_list.append(0)
                    else:
                        val_list.append(val)
                rows_to_insert.append(val_list)
                
            cursor.executemany(query, rows_to_insert)
            conn.commit()
            print(f"Seeded {len(rows_to_insert)} rows into table '{table_name}' from {csv_file}")
            
    conn.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()
