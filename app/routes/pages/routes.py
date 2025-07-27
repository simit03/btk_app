from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.services.user_service import login_student_service

pages_bp = Blueprint('pages', __name__)

@pages_bp.route('/')
def index():
    print(">>> [INDEX] Session at index:", dict(session))
    return render_template('index.html', title='Home')

@pages_bp.route('/register')
def register():
    return render_template('register.html')

@pages_bp.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('logged_in'):
        return redirect(url_for('pages.profile'))
    if request.method == 'POST':
        username = request.form.get('login-username')
        password = request.form.get('login-password')
        success, user = login_student_service(username, password)
        if success:
            session['logged_in'] = True
            session['username'] = user['username']
            session['first_name'] = user['first_name']
            session['last_name'] = user['last_name']
            session['grade'] = user['grade']
            print(">>> [LOGIN] Session after login:", dict(session))
            return redirect(url_for('pages.quiz'))
        else:
            print(">>> [LOGIN] Giriş başarısız, session:", dict(session))
            flash('Kullanıcı adı veya şifre hatalı!', 'danger')
    print(">>> [LOGIN] Session at login GET:", dict(session))
    return render_template('login.html')

@pages_bp.route('/quiz')
def quiz():
    print(">>> [QUIZ] Session at quiz:", dict(session))
    return render_template('quiz.html')

@pages_bp.route('/logout')
def logout():
    print(">>> [LOGOUT] Session before clear:", dict(session))
    session.clear()
    print(">>> [LOGOUT] Session after clear:", dict(session))
    return redirect(url_for('pages.index'))


@pages_bp.route('/profile')
def profile():
    return render_template('profile.html')

@pages_bp.route('/profile/edit', methods=['GET', 'POST'])
def profile_edit():
    from flask import session, request, redirect, url_for, flash, render_template
    from app.services.user_service import update_student_profile_service
    if not session.get('logged_in'):
        return redirect(url_for('pages.login'))
    if request.method == 'POST':
        first_name = request.form.get('edit-firstname')
        last_name = request.form.get('edit-lastname')
        password = request.form.get('edit-password')
        grade = request.form.get('edit-grade')
        username = session.get('username')
        success, msg = update_student_profile_service(username, first_name, last_name, password, grade)
        if success:
            session['first_name'] = first_name
            session['last_name'] = last_name
            session['grade'] = int(grade)
            flash('Bilgiler başarıyla güncellendi.', 'success')
            return redirect(url_for('pages.profile'))
        else:
            flash(msg, 'danger')
    return render_template('profile_edit.html',
        first_name=session.get('first_name',''),
        last_name=session.get('last_name',''))

@pages_bp.route('/stats')
def stats():
    return render_template('stats.html')

@pages_bp.route('/wrong-questions')
def wrong_questions():
    return render_template('wrong_questions.html')