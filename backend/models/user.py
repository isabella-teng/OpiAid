from datetime import datetime
from passlib.hash import sha256_crypt
from .util import TimestampModel
from . import db
from sqlalchemy import *

class User(db.Model, TimestampModel):
    metadata = MetaData()
    username = db.Column(db.String(30), unique=True, nullable=False)
    pass_hash = db.Column(db.String(100), nullable=False)
    friends_list = Table('friends_list', metadata,
                   db.Column('friend_id', db.String(50), unique=True, nullable=False))

    # push_tokens = db.relationship('PushToken', back_populates='user')

    def __init__(self, username, password):
        self.username = username
        self.pass_hash = sha256_crypt.encrypt(password)
        self.friends_list = friends_list

    def asdict(self):
        return {
            'id': self.id,
            'username': self.username,
            'created_on': self.created_on
        }
