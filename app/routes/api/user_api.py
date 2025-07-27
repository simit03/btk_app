from flask import Blueprint, request, jsonify
from app.services.user_service import register_student_service, login_student_service

user_api = Blueprint('user_api', __name__)

@user_api.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    username = data.get('username')
    password = data.get('password')
    grade = data.get('grade')
    success, message = register_student_service(first_name, last_name, username, password, grade)
    if success:
        return jsonify({'status': 'success', 'message': message}), 201
    else:
        return jsonify({'status': 'error', 'message': message}), 400

@user_api.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    success, result = login_student_service(username, password)
    if success:
        return jsonify({'status': 'success', **result}), 200
    else:
        return jsonify({'status': 'error', 'message': result}), 401 