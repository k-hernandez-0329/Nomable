
![nomable_logo](https://github.com/k-hernandez-0329/Nomable/assets/145728313/c4dd9573-bcc3-4116-825a-06d6f768597d)

## What is Nomable?

Nomable is a revolutionary solution for individuals grappling
with the perennial question "What's for dinner?". Nomable
streamlines the meal planning process by presenting users with
a curated selection of three recipes daily, spanning breakfast,
lunch, and dinner.

--

## User Stories

How it Works:
Upon logging in, users are greeted with a concise
list of three delectable recipes, carefully selected to cater to
a variety of tastes and dietary preferences. With a countdown
timer of the 24-hour window, users have a limited time to peruse
and decide on their culinary adventures for the day.

# Server Side

## Relationships:

#### JournalEntry:

One-to-Many relationship with User (user attribute), where each journal entry belongs to one user.


#### User:

-- One-to-One relationship with Profile (profile attribute), where each user has one profile. 


-- One-to-Many relationship with Recipe (recipes attribute), where each user can have multiple recipes.


-- One-to-Many relationship with FavoriteRecipe (favorite_recipes attribute), where each user can have multiple favorite recipes.


-- One-to-Many relationship with RecipeRating (recipe_ratings attribute), where each user can have multiple recipe ratings.


-- One-to-Many relationship with JournalEntry (journal_entries attribute), where each user can have multiple journal entries.


#### Profile:

-- One-to-One relationship with User (user attribute), where each profile belongs to one user.


-- One-to-Many relationship with FavoriteRecipe (favorite_recipes attribute), where each profile can have multiple favorite recipes.


#### Recipe:

-- One-to-Many relationship with User (user attribute), where each recipe belongs to one user.


-- One-to-Many relationship with FavoriteRecipe (favorite_recipes attribute), where each recipe can be favorited by multiple users.


-- One-to-Many relationship with RecipeRating (recipe_ratings attribute), where each recipe can have multiple ratings.


-- Many-to-Many relationship with Ingredient (ingredients_associations attribute), facilitated by the association table RecipeAssociation.


-- One-to-Many relationship with Comment (comments attribute), where each recipe can have multiple comments.


#### Ingredient:

-- Many-to-Many relationship with Recipe (recipes_associations attribute), facilitated by the association table RecipeAssociation.


#### RecipeAssociation:

-- Many-to-One relationship with Recipe (recipe attribute), representing the recipe associated with an ingredient.


-- Many-to-One relationship with Ingredient (ingredient attribute), representing the ingredient associated with a recipe.


#### Comment:

-- Many-to-One relationship with Recipe (recipe attribute), representing the recipe associated with a comment.

#### FavoriteRecipe:

-- Many-to-One relationship with User (user attribute), representing the user who favorited a recipe.


-- Many-to-One relationship with Recipe (recipe attribute), representing the recipe that was favorited.


-- Many-to-One relationship with Profile (profile attribute), representing the profile that favorited a recipe.

#### RecipeRating:

-- Many-to-One relationship with Recipe (recipe attribute), representing the recipe associated with a rating.


-- Many-to-One relationship with User (user attribute), representing the user who rated the recipe.


# Client Side

## Original Outlook
![Screenshot 2024-01-30 at 3 21 53 PM](https://github.com/k-hernandez-0329/Nomable/assets/145728313/58472ae5-f8a2-4c8e-ae88-a9c9d7640156)


Frontend (React Login Component):

Implements user authentication on the client-side using React and Formik.
Sends user credentials securely to the server for validation via a POST request.
Handles successful login by setting user data and redirecting.
Backend (Python User Model with Bcrypt):

Utilizes the bcrypt library for secure password hashing.
Defines user data structure and behavior, including authentication methods.
Ensures secure storage and verification of user passwords.
Implements user authorization logic to determine access rights.


Avatar Selection:

The SignUp component includes an avatar selection feature, allowing users to choose an avatar during the registration process.
Radio buttons are provided for each avatar option, accompanied by corresponding images (e.g., donut, fried egg, gummy bear, taco).
Users can select their preferred avatar by clicking on the corresponding radio button.
Profile Avatar:

Upon submission of the registration form, the selected avatar is included in the user's profile data.
The chosen avatar serves as the user's profile picture, distinguishing them within the application.

---

## Setup

### `server/`

To download the dependencies for the backend server, run:

```console
pipenv install
pipenv shell
```

### `client/`

To download the dependencies for the frontend client, run:

```console
npm install --prefix client
```

```sh
npm start --prefix client
```


