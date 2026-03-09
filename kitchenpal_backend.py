from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import base64


app = Flask(__name__)
CORS(app, origins=["*"])

API_KEY = "5c424e550e194b63995ba439ee89e108"

@app.route('/find-recipes', methods=['POST'])
def find_recipes():
    data = request.get_json()
    user_ingredients = data['ingredients']
    
    ingredients_str = ','.join(user_ingredients)
    
    url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={ingredients_str}&number=10&ranking=2&ignorePantry=true&type=main+course&apiKey={API_KEY}"
    
    response = requests.get(url)
    recipes = response.json()
    
    seen = []
    unique_recipes = []
    for recipe in recipes:
        if recipe['id'] not in seen:
            seen.append(recipe['id'])
            unique_recipes.append(recipe)
    
    return jsonify({"results": unique_recipes[:6]})


@app.route('/scan-ingredients', methods=['POST'])
def scan_ingredients():
    data = request.get_json()
    image_bytes = base64.b64decode(data['image'])

    PAT = '0d7713c2f36043a8b131566a162742a5'
    
    headers = {
        'Authorization': f'Key {PAT}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "inputs": [{
            "data": {
                "image": {
                    "base64": base64.b64encode(image_bytes).decode('utf-8')
                }
            }
        }]
    }
    
    response = requests.post(
        'https://api.clarifai.com/v2/models/bd367be194862482d179a507df182ad8/outputs',
        headers=headers,
        json=payload
    )
    
    result = response.json()
    print(result)
    concepts = result['outputs'][0]['data']['concepts']
    
    food_keywords = ['food', 'ingredient', 'vegetable', 'fruit', 'meat',
                     'cheese', 'egg', 'milk', 'bread', 'rice', 'chicken',
                     'tomato', 'onion', 'garlic', 'pepper', 'potato', 'butter', 'flour']
    
    labels = [c['name'].lower() for c in concepts]
    ingredients = [label for label in labels
                   if any(food in label for food in food_keywords) or label in food_keywords]

    return jsonify({"ingredients": ingredients})

@app.route('/random-recipes', methods=['GET'])
def random_recipes():
    url = f"https://api.spoonacular.com/recipes/random?number=3&tags=main+course&apiKey={API_KEY}"
    response = requests.get(url)
    data = response.json()
    return jsonify({"results": data['recipes']})

@app.route('/get-recipe', methods=['POST'])
def get_recipe():
    data = request.get_json()
    recipe_id = data['id']
    
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/information?includeNutrition=true&apiKey={API_KEY}"
    
    response = requests.get(url)
    recipe = response.json()
    
    return jsonify(recipe)

@app.route('/')
def home():
    return "KitchenPal backend is running! 🍳"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

