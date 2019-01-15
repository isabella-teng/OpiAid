import time
from flask import jsonify
from functools import wraps
from util import fail_dict, success_dict, print_loc

from typing import Callable, TypeVar
from models import db
from flask import flash, redirect, url_for, abort, jsonify, Response
from functools import wraps
from helpers.user import current_user


def condition_required_api(condition, msg=''):
    def g(f, msg=msg):
        @wraps(f)
        def wrap(*args, **kws):
            return f(*args, **kws) if condition() else jsonify(fail_dict(msg))
        return wrap
    return g


login_required_api = condition_required_api(current_user, msg='Error: not logged in')


def jsonify_api(f: Callable) -> Callable[..., Response]:
    @wraps(f)
    def wrap(*args, **kwargs):
        return jsonify(f(*args, **kwargs))
    return wrap


def logtime(prefix="Time: "):
    def wrapper(f):
        @wraps(f)
        def wrap(*args, **kwargs):
            start = time.time()
            ret = f(*args, **kwargs)
            end = time.time()
            print_loc(prefix, end - start)
            return ret
        return wrap
    return wrapper


def fail_on_exception(prefix, rollback=True):
    def wrapper(f):
        @wraps(f)
        def wrap(*args, **kwargs):
            try:
                return f(*args, **kwargs)
            except Exception as e:
                if rollback:
                    db.session.rollback()
                return fail_dict(f'{prefix}{str(e)}')
        return wrap
    return wrapper
