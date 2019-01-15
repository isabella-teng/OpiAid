import boto3
from factory import create_app, register_blueprints

app = create_app(__name__)
register_blueprints(app)

boto_client = boto3.client(
    's3',
    aws_access_key_id=app.config.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=app.config.get('AWS_SECRET_ACCESS_KEY'),
)

