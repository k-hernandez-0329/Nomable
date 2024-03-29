#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import random

# Remote library imports
from faker import Faker


# Local imports
from app import app
from models import db, Profile, Recipe, User, RecipeRating, FavoriteRecipe, Ingredient
from config import bcrypt


def create_users():
    avatars = [
        "/avatars.png/donut.png",
        "/avatars.png/fried-egg.png",
        "/avatars.png/gummy-bear.png",
        "/avatars.png/taco.png",
    ]

    users = []
    for _ in range(1):
        password = fake.password()
        hashed_password = bcrypt.generate_password_hash(
            password.encode("utf-8")
        ).decode("utf-8")
        u = User(
            username=fake.user_name(),
            email=fake.email(),
            _password_hash=hashed_password,
            avatar=rc(avatars),
        )
        profile = Profile()
        profile.user = u
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

    # Define recipe data for each meal type
    recipe_data = {
        "breakfast": [
            {
                "title": "Pancakes",
                "description": "Fluffy pancakes served with maple syrup.",
                "instructions": "1. Mix flour, milk, eggs, and sugar in a bowl.\n2. Heat a non-stick pan and pour batter.\n3. Cook until bubbles form, then flip.\n4. Serve hot with maple syrup.",
                "image_url": "https://images.pexels.com/photos/2516025/pexels-photo-2516025.jpeg?auto=compress&cs=tinysrgb&w=300",
                "ingredients": [
                    Ingredient(name="Flour"),
                    Ingredient(name="Milk"),
                    Ingredient(name="Eggs"),
                    Ingredient(name="Sugar"),
                    Ingredient(name="Baking Powder"),
                ],
            },
            {
                "title": "French Toast",
                "description": "Classic French toast recipe perfect for a delicious breakfast.",
                "instructions": "1. In a shallow dish, whisk together eggs, milk, vanilla extract, and cinnamon.\n2. Dip each bread slice into the egg mixture, allowing it to soak for a few seconds on each side.\n3. Heat butter in a skillet over medium heat.\n4. Cook the soaked bread slices in the skillet until golden brown on both sides, about 2-3 minutes per side.\n5. Serve hot with maple syrup.\n6. Garnish with fresh fruit and a sprinkle of powdered sugar if desired.",
                "image_url": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlbmNoJTIwdG9hc3R8ZW58MHx8MHx8fDA%3D",
                "ingredients": [
                    Ingredient(name="Bread Slices"),
                    Ingredient(name="Eggs"),
                    Ingredient(name="Milk"),
                    Ingredient(name="Vanilla Extract"),
                    Ingredient(name="Cinnamon"),
                    Ingredient(name="Butter"),
                    Ingredient(name="Maple Syrup"),
                    Ingredient(name="Fresh Fruit (optional)"),
                    Ingredient(name="Powdered Sugar (optional)"),
                ],
            },
            {
                "title": "Avocado Toast with Optional Toppings",
                "description": "A simple yet satisfying breakfast featuring creamy avocado on crispy toast, with optional spinach and black sesame toppings.",
                "instructions": "1. Toast the bread until golden brown.\n2. Mash the avocado in a bowl and season with lemon juice, salt, and black pepper.\n3. Spread the mashed avocado evenly over the toast.\n4. Top with sliced cherry tomatoes and thinly sliced red onion.\n5. Cook a sunny-side-up egg and place it on top of the toast.\n6. Sprinkle with red pepper flakes for a spicy kick.\n7. Optionally, add a handful of fresh spinach leaves and sprinkle with black sesame seeds.\n8. Serve immediately.",
                "image_url": "https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZvY2FkbyUyMHRvYXN0fGVufDB8fDB8fHww",
                "ingredients": [
                    Ingredient(name="Bread"),
                    Ingredient(name="Avocado"),
                    Ingredient(name="Egg"),
                    Ingredient(name="Cherry Tomatoes"),
                    Ingredient(name="Red Onion"),
                    Ingredient(name="Lemon"),
                    Ingredient(name="Salt"),
                    Ingredient(name="Black Pepper"),
                    Ingredient(name="Red Pepper Flakes"),
                    Ingredient(name="Spinach (optional)"),
                    Ingredient(name="Black Sesame Seeds(optional)"),
                ],
            },
        ],
        "lunch": [
            {
                "title": "Grilled Chicken Sandwich",
                "description": "Juicy grilled chicken breast served in a sandwich.",
                "instructions": "1. Marinate chicken breast with spices.\n2. Grill until fully cooked.\n3. Cook bacon until crispy.\n4. Toast bread slices.\n5. Assemble sandwich with lettuce, tomato, onion, mayonnaise, bacon, and cheese.",
                "image_url": "https://jamjarkitchen.com/wp-content/uploads/2021/06/DSC_0075-1.jpg",
                "ingredients": [
                    Ingredient(name="Chicken Breast"),
                    Ingredient(name="Bacon"),
                    Ingredient(name="Bread"),
                    Ingredient(name="Lettuce"),
                    Ingredient(name="Tomato"),
                    Ingredient(name="Onion"),
                    Ingredient(name="Mayonnaise"),
                    Ingredient(name="Cheese"),
                ],
            },
            {
                "title": "Vegetable Salad",
                "description": "A refreshing and healthy vegetable salad.",
                "instructions": "1. Chop the vegetables.\n2. Mix them in a bowl.\n3. Add any desired toppings such as cheese or dressings.\n4. Serve on a plate.",
                "image_url": "https://www.pexels.com/photo/vegetable-salad-on-white-ceramic-plate-1211887/",
                "ingredients": [
                    Ingredient(name="Lettuce"),
                    Ingredient(name="Tomato"),
                    Ingredient(name="Cucumber"),
                    Ingredient(name="Bell Pepper"),
                    Ingredient(name="Red Onion"),
                    Ingredient(name="Cheese"),
                ],
            },
            {
                "title": "BLT Sandwich",
                "description": "A classic sandwich featuring crispy bacon, fresh lettuce, and juicy tomatoes, all layered between slices of toasted bread.",
                "instructions": "1. Cook the bacon until crispy and drain excess fat on paper towels.\n2. Toast the bread slices until golden brown.\n3. Spread mayonnaise on one side of each bread slice.\n4. Layer the bacon, lettuce, and tomato on one slice of bread.\n5. Season with salt and black pepper.\n6. Top with another slice of bread.\n7. Cut the sandwich in half diagonally.\n8. Serve immediately and enjoy your delicious BLT Sandwich!",
                "image_url": "https://images.unsplash.com/photo-1705537238393-86337520ef8c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGNsdWIlMjBzYW5kd2ljaHxlbnwwfHwwfHx8MA%3D%3D",
                "ingredients": [
                    Ingredient(name="Bacon"),
                    Ingredient(name="Lettuce"),
                    Ingredient(name="Tomato"),
                    Ingredient(name="Mayonnaise"),
                    Ingredient(name="Toasted Bread"),
                    Ingredient(name="Salt"),
                    Ingredient(name="Black Pepper"),
                ],
            },
        ],
        "dinner": [
            {
                "title": "Spaghetti Carbonara",
                "description": "Classic Italian pasta dish with creamy egg sauce and crispy bacon.",
                "instructions": "1. Cook spaghetti according to package instructions.\n2. Cook bacon until crispy.\n3. Beat eggs with grated Parmesan cheese.\n4. Toss cooked spaghetti with egg mixture.\n5. Add crispy bacon and black pepper.",
                "image_url": "https://images.pexels.com/photos/998246/pexels-photo-998246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "ingredients": [
                    Ingredient(name="Spaghetti"),
                    Ingredient(name="Bacon"),
                    Ingredient(name="Eggs"),
                    Ingredient(name="Parmesan Cheese"),
                    Ingredient(name="Black Pepper"),
                ],
            },
            {
                "title": "Baked Salmon",
                "description": "Healthy and flavorful baked salmon with lemon and herbs.",
                "instructions": "1. Preheat oven to 375°F (190°C).\n2. Place salmon on a baking sheet.\n3. Drizzle with olive oil and season with salt, pepper, garlic, and dill.\n4. Bake for 12-15 minutes or until salmon is cooked through.\n5. Serve with lemon wedges.",
                "image_url": "https://images.pexels.com/photos/5741440/pexels-photo-5741440.jpeg?auto=compress&cs=tinysrgb&w=300",
                "ingredients": [
                    Ingredient(name="Salmon Fillet"),
                    Ingredient(name="Lemon"),
                    Ingredient(name="Dill"),
                    Ingredient(name="Garlic"),
                    Ingredient(name="Olive Oil"),
                    Ingredient(name="Salt"),
                    Ingredient(name="Black Pepper"),
                ],
            },
            {
                "title": "Shrimp Fried Rice",
                "description": "A classic Chinese dish made with tender shrimp, fluffy rice, and a medley of vegetables, stir-fried to perfection.",
                "instructions": "1. Cook rice according to package instructions and let it cool completely. You can also use leftover cooked rice.\n2. Heat vegetable oil in a large skillet or wok over medium-high heat. Add minced garlic and grated ginger, and cook until fragrant.\n3. Add peeled and deveined shrimp to the skillet, and cook until they turn pink and opaque. Remove the shrimp from the skillet and set aside.\n4. In the same skillet, add a bit more vegetable oil if needed. Add diced carrots and cook until slightly softened.\n5. Push the carrots to one side of the skillet and crack eggs into the empty space. Scramble the eggs until they are fully cooked.\n6. Add cooked rice to the skillet, breaking up any clumps, and stir-fry with the carrots and eggs.\n7. Stir in frozen peas and chopped green onions, followed by the cooked shrimp.\n8. Season the fried rice with soy sauce, sesame oil, salt, and black pepper. Stir everything together until well combined.\n9. Cook for an additional 2-3 minutes, allowing the flavors to meld together.\n10. Serve the shrimp fried rice hot, garnished with extra chopped green onions if desired.\n11. Enjoy your flavorful and satisfying shrimp fried rice!",
                "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlubmVyJTIwc3RpciUyMGZyeXxlbnwwfHwwfHx8MA%3D%3D",
                "ingredients": [
                    Ingredient(name="Shrimp"),
                    Ingredient(name="Rice"),
                    Ingredient(name="Eggs"),
                    Ingredient(name="Carrots"),
                    Ingredient(name="Peas"),
                    Ingredient(name="Green Onions"),
                    Ingredient(name="Garlic"),
                    Ingredient(name="Ginger"),
                    Ingredient(name="Soy Sauce"),
                    Ingredient(name="Sesame Oil"),
                    Ingredient(name="Vegetable Oil"),
                    Ingredient(name="Salt"),
                    Ingredient(name="Black Pepper"),
                ],
            },
        ],
    }

    # Shuffle the recipe data for each meal type
    for meal_type, meal_recipes in recipe_data.items():
        random.shuffle(meal_recipes)
        selected_recipe = meal_recipes[0]  # Select a random recipe from each meal type

        # Map ingredient names to their corresponding instances
        recipe_ingredients = [
            ingredient
            for ingredient in ingredients
            if ingredient.name in [ing.name for ing in selected_recipe["ingredients"]]
        ]

        recipe = Recipe(
            title=selected_recipe["title"],
            description=selected_recipe["description"],
            instructions=selected_recipe["instructions"],
            meal_type=meal_type,
            user=rc(users),
            ingredients=recipe_ingredients,
            image_url=selected_recipe["image_url"],
        )
        recipes.append(recipe)

    return recipes


def create_recipe_ratings(recipes, users):
    recipe_ratings = []
    for recipe in recipes:
        rating = randint(1, 5)
        rater = rc(users)

        if not any(rating.user_id == rater.id for rating in recipe.recipe_ratings):
            recipe_rating = RecipeRating(recipe=recipe, rating=rating, user=rater)
            recipe_ratings.append(recipe_rating)

            db.session.add(recipe_rating)
    return recipe_ratings


def create_favorite_recipes(recipes, users):
    favorite_recipes = []
    for _ in range(1):
        user = rc(users)
        recipe = rc(recipes)

        if not any(
            favorite.user_id == user.id and favorite.recipe_id == recipe.id
            for favorite in user.favorite_recipes
        ):
            favorite_recipe = FavoriteRecipe(user=user, recipe=recipe)
            favorite_recipes.append(favorite_recipe)

            db.session.add(favorite_recipe)
    return favorite_recipes


if __name__ == "__main__":
    fake = Faker("en_US")
    with app.app_context():
        print("Dropping existing tables...")
        db.drop_all()

        print("Creating tables...")
        db.create_all()

        print("Seeding users...")
        users = create_users()
        db.session.add_all(users)
        db.session.commit()

        print("Seeding ingredients...")
        ingredients = create_ingredients()
        db.session.add_all(ingredients)
        db.session.commit()

        print("Seeding recipes...")
        recipes = create_recipes(users, ingredients)
        db.session.add_all(recipes)
        db.session.commit()
        print("Recipes seeded successfully.")

        print("Seeding recipe ratings...")
        recipe_ratings = create_recipe_ratings(recipes, users)
        db.session.add_all(recipe_ratings)
        db.session.commit()
        print("Recipe ratings seeded successfully.")

        print("Seeding favorite recipes...")
        favorite_recipes = create_favorite_recipes(recipes, users)
        db.session.add_all(favorite_recipes)
        db.session.commit()
        print("Favorite recipes seeded successfully.")

        print("Complete")

    # Seed code goes here!
