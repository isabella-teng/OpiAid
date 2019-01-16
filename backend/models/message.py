from datetime import datetime
from passlib.hash import sha256_crypt
from .util import TimestampModel
from . import db


class Message(db.Model, TimestampModel):
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False, index=True)
    text = db.Column(db.Text, nullable=False)
    from_bot = db.Column(db.Boolean, nullable=False)
    # push_tokens = db.relationship('PushToken', back_populates='user')

    def __init__(self, user_id, text, from_bot):
        self.user_id = user_id
        self.text = text
        self.from_bot = from_bot
