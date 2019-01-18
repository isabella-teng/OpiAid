from typing import Optional
import re
from util import safe_strip

EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")
NAME_REGEX = re.compile(r"\S+")


def valid_string(s,
                 optional: bool = False,
                 field_name: str = 'Text',
                 min_length: int = 0,
                 max_length: Optional[int] = None,
                 strip: bool = False):
    if strip:
        s = safe_strip(s)
    name = field_name.capitalize()
    if optional and s is None:
        return s
    if not isinstance(s, str):
        raise Exception('%s must be a string' % name)
    if len(s) < min_length:
        raise Exception('%s must be at least %s chars' % (name, min_length))
    if max_length and len(s) > max_length:
        raise Exception('%s must be at most %s chars' % (name, max_length))
    return s


def valid_username(username):
    username = valid_string(username, field_name='username', min_length=2, max_length=20)
    if not username.replace("_", "").isalnum():
        raise Exception('Username must be alphanumeric + _')
    return username


def valid_email(email, optional: bool = False, min_length: int = 5, **kwargs):
    if optional and email is None:
        return email
    email = email.strip() if isinstance(email, str) else ''
    email = valid_string(email, min_length=min_length, **kwargs)
    if not EMAIL_REGEX.match(email):
        raise Exception('Invalid %s' % kwargs.get('field_name', 'email'))
    if "+" in email:
        raise Exception('%s contains "+"' % kwargs.get('field_name', 'Email'))
    return email


def valid_name(name) -> str:
    name = safe_strip(name) or ''
    name = valid_string(name, min_length=1)
    if not NAME_REGEX.match(name):
        raise Exception('Invalid name')
    return name
