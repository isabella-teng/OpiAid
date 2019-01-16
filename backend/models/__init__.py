import re
import json
from flask_sqlalchemy import SQLAlchemy, Model as FlaskModel
from sqlalchemy import Integer, Column
from sqlalchemy.ext.declarative import declared_attr


class BaseModel(FlaskModel):
    @declared_attr
    def __tablename__(self):
        # Convert model name from camel case to snake case
        # and add an s (or replace y with ies)

        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', self.__name__)
        snake = re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
        return f'{snake[:-1]}ies' if snake[-1:] == 'y' else f'{snake}s'

    @declared_attr
    def id(self):
        # Integer id primary key on every table
        return Column(Integer, primary_key=True, autoincrement=True)

    def __repr__(self):
        if hasattr(self, 'asdict') and callable(self.asdict):
            # w/ "default=str" auto turns dates and other non-serializable things into strings
            # https://stackoverflow.com/questions/11875770/how-to-overcome-datetime-datetime-not-json-serializable/36142844#36142844
            return json.dumps(self.asdict(), default=str)
        return f'<{self.__class__.__name__} {self.id}>'


db = SQLAlchemy(model_class=BaseModel)
Model = db.Model

from models.user import User
from models.message import Message
