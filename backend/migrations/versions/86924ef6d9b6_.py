"""empty message

Revision ID: 86924ef6d9b6
Revises: 
Create Date: 2019-01-15 15:20:30.896098

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '86924ef6d9b6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('created_on', sa.DateTime(), nullable=False),
    sa.Column('updated_on', sa.DateTime(), nullable=True),
    sa.Column('username', sa.String(length=30), nullable=False),
    sa.Column('pass_hash', sa.String(length=100), nullable=False),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###
