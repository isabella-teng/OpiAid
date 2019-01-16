from flask import session, Blueprint
from flask.sessions import SecureCookieSessionInterface
from constants import SESH_USER_ID
from validation import valid_string, valid_name, valid_username
from passlib.hash import sha256_crypt

from app import app
from models import db
from models.message import Message
from models.user import User
from helpers.user import current_user
from util import get_request_data, safe_strip, fail_dict, success_dict, print_loc
from decorators import jsonify_api, login_required_api

messaging_blueprint = Blueprint('messaging_blueprint', __name__)

@messaging_blueprint.route('/messages/send', methods=['GET','POST'])
@login_required_api
@jsonify_api
def send_route():
    data = get_request_data()
    text =  data.get("text")
    from_bot = True

    try:
        text = valid_string(text, field_name='Text', min_length=1, strip=True)
    except Exception as e:
        return fail_dict(f'Invalid text: {str(e)}')

    if not isinstance(from_bot, bool):
        return fail_dict('from_bot should be boolean type')

    message = Message(current_user().id, text, from_bot)
    try:
        db.session.add(message)
        db.session.commit()
    except Exception as e:
        return fail_dict(f'Error storing message: {str(e)}')
    return success_dict('Yay')
'''
messages: [
    {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
        },
    }
]
'''
@messaging_blueprint.route('/messages/get', methods=['GET'])
@login_required_api
@jsonify_api
def get_route():
    user = current_user()
    messages = Message.query.filter_by(user_id=user.id).order_by(Message.created_on).all()
    message_list = []
    for m in messages:
        message = {
            "_id": m.id,
            "text": m.text,
            "createdAt": m.created_on,
            "user": {
                "_id": user.id if not m.from_bot else 0,
                "name": user.username if not m.from_bot else '',
                "avatar": 'https://placeimg.com/140/140/any'
            }
        }
        message_list.append(message)

    return success_dict(data=message_list)
