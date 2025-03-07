"""create user table

Revision ID: a5cd34adc8f8
Revises: fb3a5b216251
Create Date: 2025-03-06 18:57:52.690962

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlmodel import SQLModel


# revision identifiers, used by Alembic.
revision: str = 'a5cd34adc8f8'
down_revision: Union[str, None] = 'fb3a5b216251'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('is_superuser', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('student_id', sa.Integer(), nullable=True),
    sa.Column('professor_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['professor_id'], ['professor.professor_id'], ),
    sa.ForeignKeyConstraint(['student_id'], ['student.student_id'], ),
    sa.PrimaryKeyConstraint('user_id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###
