#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api, bcrypt

# Add your model imports
from models import User, Recipe, Ingredient, FavoriteRecipe, RecipeRating, Comment

# Views go here!


@app.route("/")
def index():
    return "<h1>Project Server</h1>"


class Login(Resource):
    def post(self):
        json_data = request.get_json()

        username = json_data.get("username")
        password = json_data.get("password")

        if not username or not password:
            return {"error": "Username and password are required"}, 400

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session["user_id"] = user.id
            return user.to_dict(), 200
        else:
            return {"error": "Invalid username or password"}, 401


class Logout(Resource):
    def delete(self):
        session["user_id"] = None
        return {"message": "Logged Out"}, 204


class CheckSession(Resource):

    def get(self):
        user_id = session["user_id"]
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200

        return {}, 401


class ClearSession(Resource):

    def delete(self):
        session["user_id"] = None

        return {}, 204


class SignUp(Resource):

    def post(self):
        json_data = request.get_json()

        email = json_data.get("email")
        username = json_data.get("username")
        password = json_data.get("password")
        avatar = json_data.get("avatar")
        if not username or not email or not password:
            return {"error": "Username, Email, and password are required"}, 400

        if (
            User.query.filter_by(username=username).first()
            or User.query.filter_by(email=email).first()
        ):
            return {"error": "Username or email is already taken"}, 400

        hashed_password = bcrypt.generate_password_hash(
            password.encode("utf-8")
        ).decode("utf-8")

        new_user = User(
            username=username,
            email=email,
            _password_hash=hashed_password,
            avatar=avatar,
        )

        db.session.add(new_user)
        db.session.commit()

        session["user_id"] = new_user.id

        return new_user.to_dict(), 201


class Users(Resource):
    def get(self):
        return make_response([user.to_dict() for user in User.query.all()], 200)


class UsersById(Resource):
    def get(self, id):
        user = User.query.get(id)
        if user:
            return user.to_dict(), 200
        return {"error": "User not found"}, 404

    def patch(self, id):
        user = User.query.get(id)

        if not user:
            return make_response({"errors": "User not found"}, 404)

        data = request.get_json()
        if "avatar" in data:
            user.avatar = data["avatar"]

        try:
            for attr in data:
                if attr in data:
                    setattr(user, attr, data[attr])

            db.session.add(user)
            db.session.commit()
            return make_response(user.to_dict(), 200)

        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)

    def delete(self, id):
        user = User.query.get(id)
        if not user:
            return {"errors": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()

        session["user_id"] = None

        return {"message": "User profile deleted successfully"}, 204


class Recipes(Resource):
    def get(self):
        return make_response([recipe.to_dict() for recipe in Recipe.query.all()], 200)

    def post(self):
        data = request.get_json()

        title = data.get("title")
        description = data.get("description")
        instructions = data.get("instructions")
        image_url = data.get("image_url")
        meal_type = data.get("meal_type")
        user_id = data.get("user_id")
        ingredient_names = data.get("ingredients", [])

        if not title or not description or not meal_type or not user_id:
            return make_response({"errors": ["Incomplete data provided"]}, 400)

        user = User.query.get(user_id)
        if not user:
            return make_response({"errors": ["User not found"]}, 404)

        ingredients = []

        for name in ingredient_names:

            existing_ingredient = Ingredient.query.filter_by(name=name).first()

            if existing_ingredient:

                ingredients.append(existing_ingredient)
            else:

                new_ingredient = Ingredient(name=name)
                ingredients.append(new_ingredient)
                db.session.add(new_ingredient)

        new_recipe = Recipe(
            title=title,
            description=description,
            instructions=instructions,
            image_url=image_url,
            meal_type=meal_type,
            user=user,
            ingredients=ingredients,
        )

        db.session.add(new_recipe)
        db.session.commit()

        return make_response(new_recipe.to_dict(), 201)


class RecipesById(Resource):
    def get(self, id):
        recipe = Recipe.query.get(id)
        if recipe:
            return recipe.to_dict(), 200
        return {"error": "Recipe not found"}, 404

    def patch(self, id):
        recipe = Recipe.query.get(id)

        if not recipe:
            return make_response({"errors": "Recipe not found"}, 404)

        data = request.get_json()
        try:
            for attr in data:
                if attr in data:
                    setattr(recipe, attr, data[attr])

            db.session.add(recipe)
            db.session.commit()
            return make_response(recipe.to_dict(), 200)

        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)

    def delete(self, id):
        recipe = Recipe.query.get(id)
        if not recipe:
            return {"errors": "Recipe not found"}, 404

        db.session.delete(recipe)
        db.session.commit()

        return {"message": "Recipe deleted successfully"}, 204


class Ingredients(Resource):
    def get(self):
        return make_response(
            [ingredient.to_dict() for ingredient in Ingredient.query.all()], 200
        )


class FavoriteRecipes(Resource):

    def post(self, user_id, recipe_id):
        user = User.query.get(user_id)
        recipe = Recipe.query.get(recipe_id)

        if not user or not recipe:
            return {"error": "User or recipe not found"}, 404

        if user.has_favorited(recipe):
            return {"error": "Recipe already favorited by the user"}, 400

       
        favorite_recipe = FavoriteRecipe(user=user, recipe=recipe)


        db.session.add(favorite_recipe)
        db.session.commit()

        return {"message": "Recipe favorited successfully"}, 201

    def get(self, user_id):
        user = User.query.get(user_id)

        if not user:
            return {"error": "User not found"}, 404

        favorite_recipes = user.favorite_recipes
        return make_response([recipe.to_dict() for recipe in favorite_recipes], 200)

    def delete(self, user_id, recipe_id):
        user = User.query.get(user_id)
        recipe = Recipe.query.get(recipe_id)

        if not user or not recipe:
            return {"error": "User or recipe not found"}, 404

       
        favorite_recipe = FavoriteRecipe.query.filter_by(
            user_id=user.id, recipe_id=recipe.id
        ).first()

        if not favorite_recipe:
            return {"error": "Recipe is not favorited by the user"}, 400

        db.session.delete(favorite_recipe)
        db.session.commit()

        return {"message": "Recipe unfavorited successfully"}, 204


class RecipeRatings(Resource):

    def post(self, recipe_id):
        data = request.get_json()
        rating_value = data.get("rating")

        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return {"error": "Recipe not found"}, 404

        new_rating = RecipeRating(rating=rating_value, recipe=recipe)

        try:
            db.session.add(new_rating)
            db.session.commit()
            return {"message": "Rating added successfully"}, 201
        except ValueError as e:
            return {"error": f"Invalid rating value. {str(e)}"}, 400

    def get(self, recipe_id):
        recipe = Recipe.query.get(recipe_id)

        if not recipe:
            return {"error": "Recipe not found"}, 404

        ratings = recipe.recipe_ratings
        return make_response([rating.to_dict() for rating in ratings], 200)


class Comments(Resource):
    def post(self, user_id, recipe_id):
        user = User.query.get(user_id)
        recipe = Recipe.query.get(recipe_id)

        if not user or not recipe:
            return {"error": "User or recipe not found"}, 404

        json_data = request.get_json()
        text = json_data.get("text")

        if not text:
            return {"error": "Comment text is required"}, 400

        new_comment = Comment(text=text, user=user, recipe=recipe)

        try:
            db.session.add(new_comment)
            db.session.commit()
            return make_response(new_comment.to_dict(), 201)
        except ValueError:
            return make_response({"errors": ["Validation errors"]}, 400)


api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, "/check_session")
api.add_resource(ClearSession, "/clear_session")
api.add_resource(SignUp, "/signup")
api.add_resource(UsersById, "/users/<int:id>")
api.add_resource(Recipes, "/recipes")
api.add_resource(RecipesById, "/recipes/<int:id>")
api.add_resource(Ingredients, "/ingredients")
api.add_resource(FavoriteRecipes, "/favorite_recipes/<int:user_id>/<int:recipe_id>")
api.add_resource(RecipeRatings, "/recipe_ratings/<int:recipe_id>")
api.add_resource(Comments, "/users/<int:user_id>/recipes/<int:recipe_id>/comments")
if __name__ == "__main__":
    app.run(port=5555, debug=True)
