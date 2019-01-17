from datetime import datetime
from passlib.hash import sha256_crypt
from .util import TimestampModel
from . import db


class User(db.Model, TimestampModel):
    username = db.Column(db.String(30), unique=True, nullable=False)
    pass_hash = db.Column(db.String(100), nullable=False)
    # push_tokens = db.relationship('PushToken', back_populates='user')

    def __init__(self, username, password):
        self.username = username
        self.pass_hash = sha256_crypt.encrypt(password)

    def asdict(self):
        return {
            'id': self.id,
            'username': self.username
        }
