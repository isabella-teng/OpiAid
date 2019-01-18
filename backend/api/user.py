from flask import session, Blueprint
from flask.sessions import SecureCookieSessionInterface
from constants import SESH_USER_ID
from validation import valid_string, valid_name, valid_username
from passlib.hash import sha256_crypt

from app import app
from models import db
from models.user import User
from helpers.user import current_user
from util import get_request_data, safe_strip, fail_dict, success_dict, print_loc
from decorators import jsonify_api, login_required_api


session_serializer = SecureCookieSessionInterface().get_signing_serializer(app)

login_blueprint = Blueprint('login_blueprint', __name__)



def login_as_user(user_id):
    session[SESH_USER_ID] = user_id
    return success_dict(data={'session': session_serializer.dumps(dict(session)), 'id': user_id})


@login_blueprint.route('/me', methods=['POST', 'GET'])
@login_required_api
@jsonify_api
def me_route():
    return current_user().asdict()


@login_blueprint.route('/login', methods=['POST', 'GET'])
@jsonify_api
def login_route():
    data = get_request_data()
    username = safe_strip(data.get('username'))
    password = safe_strip(data.get('password'))

    user = User.query.filter_by(username=username).one_or_none()
    if not user or not sha256_crypt.verify(password, user.pass_hash):
        return fail_dict('Invalid username or password')
    return login_as_user(user.id)


@login_blueprint.route('/logout', methods=['GET'])
@login_required_api
@jsonify_api
def logout_route():
    return login_as_user(None)


@login_blueprint.route('/signup', methods=['POST', 'GET'])
@jsonify_api
def signup_route():
    # Get and strip first name, last name, phone number, username, pass, uuid
    data = get_request_data()
    print_loc(data)
    username = safe_strip(data.get('username', ''))
    password = safe_strip(data.get('password', ''))

    try:
        username = valid_username(username),
        password = valid_string(password, min_length=20, field_name='Password')
    except Exception as e:
        return fail_dict(f'Error signing up: {str(e)}')

    user = User.query.filter_by(username=username).one_or_none()

    if user:
        return fail_dict(f'Error signing up: username already in use')

    user = User(username, password)
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        return fail_dict(f'Error signing up: {str(e)}')
    return login_as_user(user.id)
