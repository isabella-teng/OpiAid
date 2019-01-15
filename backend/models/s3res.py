from enum import unique, auto
from models.util import Enum
from models import db
from helpers.files import upload_file


@unique
class S3_RES_TYPE(Enum):
    VIDEO = auto()
    PHOTO = auto()


# Creates and initializes up to 4 attributes, defaults are
# s3_bucket, s3_key, preview, type
# With prefix 'icon' they become
# icon_s3_bucket, icon_s3_key, icon_preview, icon_type
# type or preview can be omitted (for example something known to be an image) with flag args
def S3ResModel(name, prefix=None, types=None, optional=False):
    has_type = types is None or len(types) > 1
    prefix = f'{str(prefix)}_' if prefix else ''
    bucket_key = f'{prefix}s3_bucket'
    key_key = f'{prefix}s3_key'
    compressed_bucket_key = f'high_quality_{prefix}s3_bucket'
    compressed_key_key = f'high_quality_{prefix}s3_key'
    preview_key = f'{prefix}preview'
    type_key = f'{prefix}type'

    def __init__(self, f, bucket, user_id=None, allowed_types=types) -> None:
        res = upload_file(f, bucket, user_id, allowed_types) if f else [None] * 5
        key, bucket, preview, content_type, compressed_key = res

        setattr(self, key_key, key)
        setattr(self, bucket_key, bucket)
        setattr(self, preview_key, preview)
        setattr(self, compressed_key_key, compressed_key)
        setattr(self, compressed_bucket_key, bucket)
        if has_type and content_type:
            setattr(self, type_key, content_type)

    def get_url(self, compressed=False):
        bucket = getattr(self, bucket_key, None)
        key = getattr(self, key_key, None)
        if compressed:
            bucket = getattr(self, compressed_bucket_key, None) or bucket
            key = getattr(self, compressed_key_key, None) or key
        if not bucket or not key:
            return None
        return f'https://{bucket}.s3.amazonaws.com/{key}'

    def get_preview(self):
        preview = getattr(self, preview_key, None)
        return preview and f'data:image/png;base64,{preview}'

    attributes = {
        bucket_key: db.Column(db.String(64), nullable=optional),
        key_key: db.Column(db.String(512), nullable=optional),
        compressed_bucket_key: db.Column(db.String(64), nullable=True),
        compressed_key_key: db.Column(db.String(512), nullable=True),
        preview_key: db.Column(db.Text),
        f'get_{prefix}url': get_url,
        f'get_{prefix}preview': get_preview,
        f'update_{prefix}res': __init__,
        '__init__': __init__,
    }

    if has_type:
        attributes[type_key] = db.Column(db.Enum(S3_RES_TYPE, validate_strings=True))

    return type(name, (), attributes)


# Adds columns s3_key, s3_bucket, high_quality_s3_key, high_quality_s3_bucket, preview, type, and functions get_url, update_res
S3Res = S3ResModel('S3Res')

# Adds columns icon_s3_key, icon_s3_bucket, icon_preview, high_quality_icon_s3_bucket, high_quality_icon_s3_key, and function get_icon_url, update_icon_res
S3ResIcon = S3ResModel('S3ResIcon', prefix='icon', types=['PHOTO'], optional=True)

# Adds columns propic_s3_key, propic_s3_bucket, propic_preview, high_quality_propic_s3_key, high_quality_propic_s3_key, and function get_propic_url, update_propic_res
S3ResPropic = S3ResModel('S3ResPropic', prefix='propic', types=['PHOTO'], optional=True)
