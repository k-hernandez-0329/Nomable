#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Recipe, User, RecipeRating, FavoriteRecipe, Comment, Ingredient


def create_users():
    avatars = [
        "/avatars.png/donut.png",
        "/avatars.png/fried-egg.png",
        "/avatars.png/gummy-bear.png",
        "/avatars.png/taco.png",
    ]

    users = []
    for _ in range(10):
        u = User(
            username=fake.user_name(),
            email=fake.email(),
            password=fake.password(),
            avatar=rc(avatars),
        )
        users.append(u)
    return users


def create_ingredients():
    ingredients = []
    ingredient_names = [
        "Salt",
        "Pepper",
        "Sugar",
        "Flour",
        "Eggs",
        "Milk",
        "Butter",
        "Oil",
        "Onion",
        "Garlic",
        "Tomato",
        "Chicken",
        "Beef",
        "Pasta",
        "Rice",
        "Cheese",
        "Broccoli",
        "Spinach",
        "Lemon",
        "Cucumber",
    ]

    for name in ingredient_names:
        i = Ingredient(name=name)
        ingredients.append(i)

    return ingredients


def create_recipes(users, ingredients):
    recipes = []

    image_url = (
        "https://www.pexels.com/photo/vegetable-salad-on-white-ceramic-plate-1211887/"
    )
    recipe = Recipe(
        title="Vegetable Salad",
        description="A refreshing and healthy vegetable salad.",
        instructions="1. Chop the vegetables.\n2. Mix them in a bowl.\n3. Serve on a white ceramic plate.",
        meal_type="Lunch",
        user=rc(users),
        ingredients=rc(ingredients, k=5),
        image_url=image_url,
    )
    recipes.append(recipe)


if __name__ == "__main__":
    fake = Faker("en_US")
    with app.app_context():
        print("Creating tables...")
        db.create_all()

    # Seed code goes here!
