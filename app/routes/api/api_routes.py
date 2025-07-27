# =============================================================================
# 1.0. MODÜL BAŞLIĞI VE AÇIKLAMASI
# =============================================================================
# Bu modül, Flask uygulamasının API rotalarını (endpoints) içerir.
# Rotalar, gelen HTTP isteklerini karşılar, ilgili servis katmanı
# metotlarını çağırır ve dönen sonuçları JSON formatında yanıtlar.
# =============================================================================

# =============================================================================
# 2.0. İÇİNDEKİLER
# =============================================================================
# 3.0. GEREKLİ KÜTÜPHANELER VE MODÜLLER
# 4.0. SERVİS BAŞLATMA
# 5.0. API ROTALARI (API ROUTES)
#   5.1. Sistem Durumu Rotası (Health Check)
#     5.1.1. GET /health
#   5.2. Kullanıcı Rotaları (User Routes)
#     5.2.1. GET /users
#     5.2.2. POST /users
# =============================================================================

# =============================================================================
# 3.0. GEREKLİ KÜTÜPHANELER VE MODÜLLER
# =============================================================================
from flask import Blueprint, jsonify, request
from datetime import datetime
from app.database.user_repository import add_student, get_student_by_username, add_student_answer
from werkzeug.security import check_password_hash

# Create the blueprint
api_bp = Blueprint('api', __name__)

# Import services here to avoid circular imports
try:
    from app.services.user_service import UserService
except ImportError as e:
    print(f"Warning: Could not import UserService: {e}")
    UserService = None

# =============================================================================
# 4.0. SERVİS BAŞLATMA
# =============================================================================
# Rotaların kullanacağı servis sınıfından bir örnek oluşturulur.
user_service = UserService()

# =============================================================================
# 5.0. API ROTALARI (API ROUTES)
# =============================================================================

# -------------------------------------------------------------------------
# 5.1. Sistem Durumu Rotası (Health Check)
# -------------------------------------------------------------------------
@api_bp.route('/health', methods=['GET'])
def health_check():
    """5.1.1. API'nin çalışır durumda olduğunu kontrol eder."""
    # Bu rota basit olduğu için doğrudan veritabanına erişebilir veya
    # servis üzerinden bir "ping" metodu çağırabilir.
    return jsonify({
        'status': 'success',
        'message': 'API is running',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# -------------------------------------------------------------------------
# 5.2. Kullanıcı Rotaları (User Routes)
# -------------------------------------------------------------------------
@api_bp.route('/users', methods=['GET'])
def get_users():
    """5.2.1. Tüm kullanıcıları listeler."""
    try:
        users = user_service.get_all_users() # Servis metodu çağrıldı
        return jsonify({
            'status': 'success',
            'data': users
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch users',
            'error': str(e)
        }), 500

@api_bp.route('/users', methods=['POST'])
def create_user():
    """5.2.2. Yeni bir kullanıcı oluşturur."""
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'Invalid JSON'}), 400

    # Tüm iş mantığı servis katmanına devredildi.
    success, result = user_service.create_new_user(data)

    if success:
        return jsonify({
            'status': 'success',
            'message': 'User created successfully',
            'data': result
        }), 201  # 201 Created
    else:
        # Hata mesajı servisten geldiği için doğrudan kullanılır.
        return jsonify({
            'status': 'error',
            'message': result.get('message', 'An error occurred'),
            'details': result
        }), 400  # 400 Bad Request

@api_bp.route('/register', methods=['POST'])
def register_student():
    data = request.get_json()
    required = ['first_name', 'last_name', 'username', 'password', 'grade']
    if not data or not all(data.get(k) for k in required):
        print("Eksik alanlar var!")
        return jsonify({'status': 'error', 'message': 'Eksik alanlar var!'}), 400
    if get_student_by_username(data['username']):
        print("Kullanıcı adı zaten var!")
        return jsonify({'status': 'error', 'message': 'Kullanıcı adı zaten var!'}), 400
    add_student(data['first_name'], data['last_name'], data['username'], data['password'], data['grade'])
    return jsonify({'status': 'success', 'message': 'Kayıt başarılı!'}), 201

@api_bp.route('/login', methods=['POST'])
def login_student():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'status': 'error', 'message': 'Kullanıcı adı ve şifre gerekli!'}), 400
    student = get_student_by_username(data['username'])
    if not student or not check_password_hash(student['password'], data['password']):
        return jsonify({'status': 'error', 'message': 'Kullanıcı adı veya şifre hatalı!'}), 401
    return jsonify({
        'status': 'success',
        'message': 'Giriş başarılı!',
        'student_id': student['id'],
        'first_name': student['first_name'],
        'last_name': student['last_name'],
        'grade': student['grade']
    }), 200

@api_bp.route('/save_answer', methods=['POST'])
def save_answer():
    data = request.get_json()
    required = ['student_id', 'question_id', 'is_correct', 'answer']
    if not data or not all(k in data for k in required):
        return jsonify({'status': 'error', 'message': 'Eksik veri!'}), 400
    add_student_answer(data['student_id'], data['question_id'], int(data['is_correct']), data['answer'])
    return jsonify({'status': 'success', 'message': 'Cevap kaydedildi!'}), 201

@api_bp.route('/profile/update', methods=['POST'])
def update_profile():
    from flask import session
    if not session.get('logged_in'):
        return jsonify({'status': 'error', 'message': 'Giriş yapmalısınız!'}), 401
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')
    username = session.get('username')
    if not first_name or not last_name:
        return jsonify({'status': 'error', 'message': 'Ad ve soyad zorunlu!'}), 400
    from app.services.user_service import update_student_profile_service
    success, msg = update_student_profile_service(username, first_name, last_name, password)
    if success:
        session['first_name'] = first_name
        session['last_name'] = last_name
        return jsonify({'status': 'success', 'message': msg})
    else:
        return jsonify({'status': 'error', 'message': msg}), 400