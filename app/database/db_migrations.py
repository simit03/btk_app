from app.database.db_connection import DatabaseConnection

def create_students_table():
    db = DatabaseConnection()
    try:
        with db as conn:
            query = '''
                CREATE TABLE IF NOT EXISTS students (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(64) NOT NULL,
                    last_name VARCHAR(64) NOT NULL,
                    username VARCHAR(64) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    grade INT NOT NULL
                )
            '''
            conn.cursor.execute(query)
            conn.connection.commit()
    finally:
        db.close()

if __name__ == "__main__":
    create_students_table()