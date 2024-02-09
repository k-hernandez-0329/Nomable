from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import Enum
from datetime import datetime
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt


# Models go here!


recipe_ingredients = db.Table(
    "recipe_ingredients",
    db.Column("recipe_id", db.Integer, db.ForeignKey("recipes.id"), primary_key=True),
    db.Column(
        "ingredient_id", db.Integer, db.ForeignKey("ingredients.id"), primary_key=True
    ),
)


class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, nullable=True)

    profile = db.relationship("Profile", back_populates="user")

    recipes = db.relationship(
        "Recipe", back_populates="user", cascade="all, delete-orphan"
    )

    favorite_recipes = db.relationship(
        "FavoriteRecipe", back_populates="user", cascade="all, delete-orphan"
    )
    recipe_ratings = db.relationship(
        "RecipeRating", back_populates="user", cascade="all, delete-orphan"
    )

    serialize_rules = (
        "-favorite_recipes.user",
        "-recipe_ratings.user",
    )

    @validates("email", "username")
    def validates_user(self, _, value):
        if not value:
            raise ValueError("Email and Username cannot be left empty")
        return value

    @hybrid_property
    def password_hash(self):
        raise Exception("Password hashes may not be viewed.")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username}, avatar={self.avatar})>"


class Profile(db.Model, SerializerMixin):
    __tablename__ = "profiles"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    avatar = db.Column(db.String, nullable=True)
    user = db.relationship("User", back_populates="profile")
    favorite_recipes = db.relationship("FavoriteRecipe", back_populates="profile")

    serialize_only = ("id", "user_id", "avatar")

    def update_avatar(self, new_avatar):
        self.avatar = new_avatar

    def __repr__(self):
        return f"<Profile(id={self.id}, user_id={self.user_id})>"


class Recipe(db.Model, SerializerMixin):
    __tablename__ = "recipes"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.Text)
    instructions = db.Column(db.Text)
    image_url = db.Column(db.String)
    meal_type = db.Column(
        Enum("Breakfast", "Lunch", "Dinner", name="meal_type"), nullable=False
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="recipes")
    favorite_recipes = db.relationship(
        "FavoriteRecipe", back_populates="recipe", cascade="all, delete-orphan"
    )

    recipe_ratings = db.relationship(
        "RecipeRating", back_populates="recipe", cascade="all, delete-orphan"
    )

    ingredients = db.relationship(
        "Ingredient",
        secondary=recipe_ingredients,
        back_populates="_recipes",
    )
    comments = db.relationship(
        "Comment", back_populates="recipe", cascade="all, delete-orphan"
    )

    serialize_rules = ("-favorited_by.recipes", "-comments.recipe")


class Ingredient(db.Model, SerializerMixin):
    __tablename__ = "ingredients"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    _recipes = db.relationship(
        "Recipe",
        secondary=recipe_ingredients,
        back_populates="ingredients",
    )

    recipes = association_proxy("_recipes", "title")

    serialize_rules = ("-recipes.favorited_by", "-recipes.comments.recipe")


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)

    recipe = db.relationship("Recipe", back_populates="comments", single_parent=True)

    serialize_rules = ("-recipe.favorited_by.recipes",)

    @validates("text")
    def validate_text(self, _, text):
        if not text:
            raise ValueError("Text cannot be blank.")
        return text


class FavoriteRecipe(db.Model, SerializerMixin):
    __tablename__ = "favorite_recipes"
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)
    profile_id = db.Column(db.Integer, db.ForeignKey("profiles.id"), nullable=True)

    user = db.relationship("User", back_populates="favorite_recipes", cascade="all")
    recipe = db.relationship("Recipe", back_populates="favorite_recipes", cascade="all")
    profile = db.relationship("Profile", back_populates="favorite_recipes")

    serialize_rules = ("-user.favorite_recipes", "-recipe.favorite_recipes")


class RecipeRating(db.Model, SerializerMixin):
    __tablename__ = "recipe_ratings"
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Float, nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    recipe = db.relationship(
        "Recipe", back_populates="recipe_ratings", single_parent=True
    )
    user = db.relationship("User", back_populates="recipe_ratings")
    serialize_rules = ("-recipe.favorited_by.recipes",)

    @validates("rating")
    def validate_rating(self, key, rating):
        if not (0 <= rating <= 5):
            raise ValueError("Rating must be between 0 and 5.")
        return rating
