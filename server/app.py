#!/usr/bin/env python3

# Standard library imports
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import os

# Remote library imports
from flask import (
    render_template,
    request,
    session,
    make_response,
    jsonify,
    render_template,
    send_from_directory,
)
from flask_restful import Resource

# Local imports
from config import app, db, api, bcrypt

# Add your model imports
from models import (
    User,
    Profile,
    Recipe,
    Ingredient,
    FavoriteRecipe,
    RecipeRating,
    Comment,
    JournalEntry,
)

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
            return {"error": "Username, Email, and Password are required"}, 400

        if (
            User.query.filter_by(username=username).first()
            or User.query.filter_by(email=email).first()
        ):
            return {"error": "Username or Email is already taken"}, 400

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
            user.profile.update_avatar(data["avatar"])
        try:
            for attr in data:
                if attr != "avatar":
                    setattr(user, attr, data[attr])

            db.session.commit()
            return make_response(user.to_dict(), 200)

        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)

    # def patch(self, id):
    #     user = User.query.get(id)

    #     if not user:
    #         return make_response({"errors": "User not found"}, 404)

    #     data = request.get_json()
    #     if "avatar" in data:
    #         user.avatar = data["avatar"]

    #     try:
    #         for attr in data:
    #             if attr in data:
    #                 setattr(user, attr, data[attr])

    #         db.session.add(user)
    #         db.session.commit()
    #         return make_response(user.to_dict(), 200)

    #     except ValueError:
    #         return make_response({"errors": ["validation errors"]}, 400)

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

        if not all([title, description, meal_type, user_id]):
            return make_response(jsonify({"errors": ["Incomplete data provided"]}), 400)

        user = User.query.get(user_id)
        if not user:
            return make_response(jsonify({"errors": ["User not found"]}), 404)

        ingredients = []

        for name in ingredient_names:
            existing_ingredient = Ingredient.query.filter_by(name=name).first()
            if existing_ingredient:
                ingredients.append(existing_ingredient)
            else:
                new_ingredient = Ingredient(name=name)
                db.session.add(new_ingredient)
                ingredients.append(new_ingredient)

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

        return make_response(jsonify(new_recipe.to_dict()), 201)


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

        if recipe_id in user.favorite_recipes:
            user.favorite_recipes.remove(recipe_id)
            return {"message": "Recipe unfavorited successfully"}, 200
        else:
            user.favorite_recipes.append(recipe)
            return {"message": "Recipe favorited successfully"}, 201

    def get(self, user_id):
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        # Get user's favorite recipe IDs
        favorite_recipe_ids = user.favorite_recipes

        # Query favorite recipes
        favorite_recipes = Recipe.query.filter(Recipe.id.in_(favorite_recipe_ids)).all()

        return [recipe.to_dict() for recipe in favorite_recipes], 200

    def delete(self, user_id, recipe_id):
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        # Check if recipe exists
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return {"error": "Recipe not found"}, 404

        # Remove recipe from user's favorites
        if recipe_id in user.favorite_recipes:
            user.favorite_recipes.remove(recipe_id)
            db.session.commit()
            return {"message": "Recipe unfavorited successfully"}, 200
        else:
            return {"error": "Recipe is not favorited by the user"}, 400


class RecipeRatings(Resource):

    def get(self, recipe_id):
        recipe = Recipe.query.get(recipe_id)

        if not recipe:
            return {"error": "Recipe not found"}, 404

        ratings = RecipeRating.query.filter_by(recipe_id=recipe_id).all()
        return make_response([rating.to_dict() for rating in ratings], 200)

    def post(self, recipe_id):
        data = request.get_json()
        user_id = data.get("user_id")
        rating_value = data.get("rating")

        if not user_id or not rating_value:
            return {"error": "User ID and recipe rating are required"}, 400

        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return {"error": "Recipe not found"}, 404

        new_rating = RecipeRating(rating=rating_value, recipe=recipe, user_id=user_id)

        try:
            db.session.add(new_rating)
            db.session.commit()

            # Fetch all ratings for the recipe after adding the new rating
            ratings = RecipeRating.query.filter_by(recipe_id=recipe_id).all()
            ratings_data = [{"value": rating.rating} for rating in ratings]

            return {"ratings": ratings_data}, 201
        except ValueError as e:
            return {"error": f"Invalid rating value. {str(e)}"}, 400


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


class Profile(Resource):

    def get(self, id):
        profile = Profile.query.get(id)
        if profile:
            return profile.to_dict(), 200
        return {"error": "Profile not found"}, 404


# def get(self):
#     profiles = Profile.query.all()
#     return make_response([profile.to_dict() for profile in profiles], 200)


class ProfilesById(Resource):
    def get(self, id):
        profile = Profile.query.get(id)
        if profile:
            return jsonify(profile.serialize()), 200
        return {"error": "Profile not found"}, 404

    def patch(self, id):
        profile = Profile.query.get(id)

        if not profile:
            return make_response({"errors": "Profile not found"}, 404)

        data = request.get_json()
        if "avatar" in data:
            profile.update_avatar(data["avatar"])  # Update avatar if provided

        try:
            for attr in data:
                if attr != "avatar":  # Skip avatar since it's handled separately
                    setattr(profile, attr, data[attr])

            db.session.commit()
            return jsonify(profile.serialize()), 200

        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)

    def delete(self, id):
        profile = Profile.query.get(id)
        if not profile:
            return {"errors": "Profile not found"}, 404

        db.session.delete(profile)
        db.session.commit()

        return {"message": "Profile deleted successfully"}, 204


class NewRecipes(Resource):
    def get(self):
        # Calculate the date 24 hours ago from now
        twenty_four_hours_ago = datetime.now() - timedelta(hours=24)

        # Query recipes created after 24 hours ago
        new_recipes = Recipe.query.filter(
            Recipe.created_at >= twenty_four_hours_ago
        ).all()

        if new_recipes:
            return make_response([recipe.to_dict() for recipe in new_recipes], 200)
        else:
            return {"message": "No new recipes found in the last 24 hours"}, 404


class SubmitJournalEntryForm(Resource):
    def get(self):
        return render_template("submit_journal_entry_form.html")

    def post(self):
        data = request.form
        # title = data.get("title")
        # content = data.get("content")
        image_file = request.files.get("image")

        user_id = session.get("user_id")

        if not user_id:
            return {"error": "User not logged in"}, 401

        # if not title or not content:
        #     return {"error": "Title and content are required fields"}, 400

        if image_file:
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(
                app.config["UPLOAD_FOLDER"], "journal_images", filename
            )
            image_file.save(image_path)

        # Save the journal entry to the database here

        return {"message": "Image added"}, 201


class UploadedFile(Resource):
    def get(self, folder, filename):
        try:
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], folder, filename)
            return send_from_directory(
                os.path.dirname(file_path), os.path.basename(file_path)
            )
        except Exception as e:
            return {"error": str(e)}, 500


class ImageList(Resource):
    def get(self):
        try:
            folder_path = os.path.join(app.config["UPLOAD_FOLDER"], "journal_images")
            filenames = os.listdir(folder_path)
            return {"image_urls": filenames}, 200
        except Exception as e:
            return {"error": str(e)}, 500


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
api.add_resource(Profile, "/profiles")
api.add_resource(ProfilesById, "/profiles/<int:id>")
api.add_resource(NewRecipes, "/new_recipes")
api.add_resource(SubmitJournalEntryForm, "/submit_journal_entry_form")
api.add_resource(UploadedFile, "/uploads/<string:folder>/<string:filename>")
api.add_resource(ImageList, "/uploads/journal_images")
if __name__ == "__main__":
    app.run(port=5555, debug=True)
