"""Adjusted all tables

Revision ID: a64b7fdfe6d8
Revises: b019d6cd4f32
Create Date: 2024-02-12 13:55:39.206614

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a64b7fdfe6d8'
down_revision = 'b019d6cd4f32'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('recipe_associations',
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('ingredient_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['ingredient_id'], ['ingredients.id'], name=op.f('fk_recipe_associations_ingredient_id_ingredients')),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], name=op.f('fk_recipe_associations_recipe_id_recipes')),
    sa.PrimaryKeyConstraint('recipe_id', 'ingredient_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('recipe_associations')
    # ### end Alembic commands ###
