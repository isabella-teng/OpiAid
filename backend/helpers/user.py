from plugins.cache import cache
from models.user import User
from flask import session
from constants import SESH_USER_ID


@cache.memoize(30)
def get_user(**kwargs):
    return User.query.filter_by(**kwargs).one_or_none()


def signed_in() -> bool:
    return bool(session.get(SESH_USER_ID))


def current_user():
    if not signed_in():
        return None
    return get_user(id=session.get(SESH_USER_ID))
