# =============================================================================
# 1.0. MODÜL BAŞLIĞI VE AÇIKLAMASI
# =============================================================================
# Bu modül, kullanıcılar (`users` tablosu) ile ilgili tüm veritabanı
# işlemlerini (CRUD) yöneten `UserRepository` sınıfını içerir.
# =============================================================================

# =============================================================================
# 2.0. İÇİNDEKİLER (GÜNCELLENDİ)
# =============================================================================
# 3.0. GEREKLİ KÜTÜPHANELER
# 4.0. USERREPOSITORY SINIFI
#   4.1. Başlatma ve Bağlantı Sahipliği
#     4.1.1. __init__(self, db_connection)
#   4.2. Dahili Bağlantı Yönetimi
#     4.2.1. _ensure_connection(self)
#     4.2.2. _close_if_owned(self)
#   4.3. CRUD (Create, Read, Update, Delete) Metotları
#     4.3.1. create_user(self, username, password)
#     4.3.2. get_user(self, username)
#     4.3.3. delete_user(self, username)
#     4.3.4. change_password(self, username, new_password)
#     4.3.5. get_user_by_id(self, user_id)
#     4.3.6. get_all_users(self)
# =============================================================================

# =============================================================================
# 3.0. GEREKLİ KÜTÜPHANELER
# =============================================================================
from mysql.connector import Error as MySQLError
from typing import Optional, Dict, List
from app.database.db_connection import DatabaseConnection
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

# =============================================================================
# 4.0. USERREPOSITORY SINIFI
# =============================================================================
class UserRepository:
    """
    Kullanıcı verilerinin veritabanı işlemlerini yönetir.
    """

    # -------------------------------------------------------------------------
    # 4.1. Başlatma ve Bağlantı Sahipliği
    # -------------------------------------------------------------------------
    def __init__(self, db_connection: Optional[DatabaseConnection] = None):
        """4.1.1. Sınıfın kurucu metodu. Harici veya dahili bağlantı kullanır."""
        if db_connection:
            self.db: DatabaseConnection = db_connection
            self.own_connection: bool = False
        else:
            self.db: DatabaseConnection = DatabaseConnection()
            self.own_connection: bool = True

    # -------------------------------------------------------------------------
    # 4.2. Dahili Bağlantı Yönetimi
    # -------------------------------------------------------------------------
    def _ensure_connection(self):
        """4.2.1. Veritabanı bağlantısı kapalıysa yeniden kurar."""
        self.db._ensure_connection()

    def _close_if_owned(self):
        """4.2.2. Eğer bağlantı bu sınıf tarafından oluşturulduysa kapatır."""
        if self.own_connection:
            self.db.close()

    # -------------------------------------------------------------------------
    # 4.3. CRUD (Create, Read, Update, Delete) Metotları
    # -------------------------------------------------------------------------
    def create_user(self, username: str, password_hash: str) -> Optional[int]:
        """4.3.1. Veritabanına yeni bir kullanıcı ekler."""
        self._ensure_connection()
        try:
            with self.db as conn:
                query = "INSERT INTO users (username, password) VALUES (%s, %s)"
                conn.cursor.execute(query, (username, password_hash))
                conn.connection.commit()
                return conn.cursor.lastrowid
        except MySQLError as e:
            if e.errno == 1062: # Duplicate entry
                return None
            self.db.connection.rollback()
            return None
        finally:
            self._close_if_owned()

    def get_user(self, username: str) -> Optional[Dict]:
        """4.3.2. Kullanıcı adına göre bir kullanıcıyı getirir."""
        self._ensure_connection()
        try:
            with self.db as conn:
                query = "SELECT id, username, password FROM users WHERE username = %s"
                conn.cursor.execute(query, (username,))
                return conn.cursor.fetchone()
        except MySQLError:
            return None
        finally:
            self._close_if_owned()

    def delete_user(self, username: str) -> bool:
        """4.3.3. Bir kullanıcıyı kullanıcı adına göre siler."""
        self._ensure_connection()
        try:
            with self.db as conn:
                query = "DELETE FROM users WHERE username = %s"
                conn.cursor.execute(query, (username,))
                conn.connection.commit()
                return conn.cursor.rowcount > 0
        except MySQLError:
            self.db.connection.rollback()
            return False
        finally:
            self._close_if_owned()

    def change_password(self, username: str, new_password_hash: str) -> bool:
        """4.3.4. Bir kullanıcının şifresini günceller."""
        self._ensure_connection()
        try:
            with self.db as conn:
                query = "UPDATE users SET password = %s WHERE username = %s"
                conn.cursor.execute(query, (new_password_hash, username))
                conn.connection.commit()
                return conn.cursor.rowcount > 0
        except MySQLError:
            self.db.connection.rollback()
            return False
        finally:
            self._close_if_owned()
            
    # =========================================================================
    # YENİ EKLENEN FONKSİYONLAR
    # =========================================================================

    def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        """4.3.5. ID'ye göre bir kullanıcıyı getirir."""
        self._ensure_connection()
        try:
            with self.db as conn:
                query = "SELECT id, username, password FROM users WHERE id = %s"
                conn.cursor.execute(query, (user_id,))
                return conn.cursor.fetchone()
        except MySQLError:
            return None
        finally:
            self._close_if_owned()

    def get_all_users(self) -> List[Dict]:
        """4.3.6. Veritabanındaki tüm kullanıcıları getirir."""
        self._ensure_connection()
        try:
            with self.db as conn:
                query = "SELECT id, username, password FROM users"
                conn.cursor.execute(query)
                return conn.cursor.fetchall()
        except MySQLError:
            return []
        finally:
            self._close_if_owned()

# Öğrenci ekle

def add_student(first_name, last_name, username, password, grade):
    db = DatabaseConnection()
    try:
        with db as conn:
            hashed_pw = generate_password_hash(password)
            query = """
                INSERT INTO students (first_name, last_name, username, password, grade)
                VALUES (%s, %s, %s, %s, %s)
            """
            conn.cursor.execute(query, (first_name, last_name, username, hashed_pw, grade))
            conn.connection.commit()
    finally:
        db.close()

# Kullanıcı adı ile öğrenci bul

def get_student_by_username(username):
    db = DatabaseConnection()
    try:
        with db as conn:
            query = "SELECT * FROM students WHERE username = %s"
            conn.cursor.execute(query, (username,))
            return conn.cursor.fetchone()
    finally:
        db.close()

# Öğrenci cevaplarını kaydet (eğer tablo varsa, yoksa fonksiyon boş kalsın)
def add_student_answer(student_id, question_id, is_correct, answer):
    db = DatabaseConnection()
    try:
        with db as conn:
            query = """
                INSERT INTO student_answers (student_id, question_id, is_correct, answer)
                VALUES (%s, %s, %s, %s)
            """
            conn.cursor.execute(query, (student_id, question_id, is_correct, answer))
            conn.connection.commit()
    finally:
        db.close()

def update_student_profile(username, first_name, last_name, password):
    db = DatabaseConnection()
    try:
        with db as conn:
            if password:
                hashed_pw = generate_password_hash(password)
                query = """
                    UPDATE students SET first_name=%s, last_name=%s, password=%s WHERE username=%s
                """
                conn.cursor.execute(query, (first_name, last_name, hashed_pw, username))
            else:
                query = """
                    UPDATE students SET first_name=%s, last_name=%s WHERE username=%s
                """
                conn.cursor.execute(query, (first_name, last_name, username))
            conn.connection.commit()
            if conn.cursor.rowcount > 0:
                return True, 'Profil başarıyla güncellendi.'
            else:
                return False, 'Güncellenecek kullanıcı bulunamadı.'
    except Exception as e:
        return False, f'Hata: {e}'
    finally:
        db.close()
