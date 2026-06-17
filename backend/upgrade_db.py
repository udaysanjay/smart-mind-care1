import sqlite3
import os

def main():
    db_path = os.path.join(os.path.dirname(__file__), "mindcare.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE meetings ADD COLUMN notes VARCHAR;")
        print("✅ Successfully added 'notes' column to meetings table.")
    except sqlite3.OperationalError as e:
        print(f"⚠️ {e} (The column might already exist).")
    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()