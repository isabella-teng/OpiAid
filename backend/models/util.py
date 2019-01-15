from datetime import datetime
from models import db


class TimestampModel:
    created_on: datetime = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_on: datetime = db.Column(db.DateTime, onupdate=datetime.utcnow)
