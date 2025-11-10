from flask import Flask, render_template, request, jsonify
import json
import random

app = Flask(__name__)

# Comprehensive knowledge base for fitness and lifestyle
RESPONSES = {
    "hello": [
        "Hello! I'm your Fitness Assistant. I can help with workout plans, nutrition advice, weight management, and healthy lifestyle tips. What would you like to know?",
        "Hi there! I'm here to help you with all things fitness and wellness. Ask me about exercises, meal plans, or healthy living!"
    ],
    "workout": [
        "Here's a balanced workout plan for beginners to intermediate:\n\nCardio (3-4x/week):\n- 30 minutes of moderate-intensity exercise (brisk walking, cycling, swimming)\n- Try HIIT workouts 1-2x/week for better fat burning\n\nStrength Training (3x/week):\n- Full-body workouts or split routines\n- Focus on compound movements: squats, deadlifts, bench press, rows, pull-ups\n- 3-4 sets of 8-12 reps per exercise\n\nFlexibility & Mobility (Daily):\n- 10-15 minutes of stretching or yoga\n- Focus on major muscle groups and problem areas\n\nRemember to warm up before and cool down after each session!",
        
        "Advanced Workout Split Example:\n\nMonday: Chest & Triceps\n- Bench Press 4x6-8\n- Incline Dumbbell Press 3x8-10\n- Dips 3xMax\n- Tricep Pushdowns 3x12-15\n\nTuesday: Back & Biceps\n- Pull-ups 4xMax\n- Barbell Rows 4x8-10\n- Face Pulls 3x12-15\n- Barbell Curls 3x10-12\n\nWednesday: Rest or Active Recovery\n\nThursday: Legs\n- Squats 5x5\n- Romanian Deadlifts 4x8\n- Leg Press 3x10-12\n- Calf Raises 4x15-20\n\nFriday: Shoulders & Abs\n- Overhead Press 4x6-8\n- Lateral Raises 3x12-15\n- Rear Delt Flyes 3x12-15\n- Plank 3x60sec"
    ],
    "diet": [
        "Here's a comprehensive nutrition guide for fitness enthusiasts:\n\nMacronutrient Breakdown:\n- Protein: 1.6-2.2g per kg of body weight (lean meats, fish, eggs, dairy, legumes)\n- Carbohydrates: 3-5g per kg of body weight (whole grains, fruits, vegetables)\n- Fats: 0.8-1g per kg of body weight (avocados, nuts, olive oil, fatty fish)\n\nMeal Timing:\n- Eat every 3-4 hours\n- Pre-workout: Carbs + Protein (1-2 hours before)\n- Post-workout: Protein + Carbs (within 30-60 minutes)\n\nHydration:\n- 3-4L of water daily\n- More if you're sweating heavily"
    ],
    "weight loss": [
        "Effective Weight Loss Strategy:\n\n1. Calorie Deficit (300-500 calories below maintenance)\n2. High-Protein Diet (25-30% of calories)\n3. Strength Training 3-4x/week\n4. Cardio: 150-300 minutes of moderate activity weekly\n5. Sleep 7-9 hours/night\n6. Manage stress (meditation, yoga, walking)\n\nSample Meal Plan for Weight Loss (1600-1800 calories):\n- Breakfast: 3 eggs + 1 slice whole grain toast + 1/2 avocado\n- Snack: Greek yogurt + handful of berries\n- Lunch: Grilled chicken + quinoa + mixed vegetables\n- Snack: Protein shake + small apple\n- Dinner: Baked salmon + sweet potato + steamed broccoli"
    ],
    "muscle gain": [
        "Muscle Building Guide:\n\nTraining:\n- Progressive overload (increase weight/reps over time)\n- Focus on compound movements\n- Train each muscle group 2x/week\n- 3-5 sets of 6-12 reps\n- Rest 60-90 seconds between sets\n\nNutrition (Bulking Phase):\n- 300-500 calorie surplus\n- 2.2g protein per kg body weight\n- 4-7g carbs per kg body weight\n- 0.8-1g fat per kg body weight\n\nSupplements (if needed):\n1. Whey Protein\n2. Creatine Monohydrate\n3. Omega-3\n4. Multivitamin\n5. Vitamin D3"
    ],
    "cardio": [
        "Cardio Training Guide:\n\nTypes of Cardio:\n1. LISS (Low-Intensity Steady State):\n   - 45-60 minutes at 60-70% max HR\n   - Great for beginners and active recovery\n   \n2. MISS (Moderate-Intensity Steady State):\n   - 30-45 minutes at 70-80% max HR\n   - Good balance of fat burning and endurance\n   \n3. HIIT (High-Intensity Interval Training):\n   - 15-30 minutes total\n   - 30s max effort / 60-90s recovery\n   - Excellent for time efficiency and EPOC effect\n\nRecommendation: Mix all three types for optimal results!"
    ],
    "nutrition": [
        "Comprehensive Nutrition Guide:\n\n1. Protein Sources:\n   - Animal: Chicken, turkey, lean beef, fish, eggs, dairy\n   - Plant: Tofu, tempeh, lentils, chickpeas, quinoa\n\n2. Healthy Fats:\n   - Avocados, nuts, seeds, olive oil, fatty fish\n   - Aim for 20-35% of daily calories\n\n3. Complex Carbs:\n   - Sweet potatoes, brown rice, quinoa, oats, whole grains\n   - Include 1-2 servings per meal\n\n4. Micronutrients:\n   - Eat a rainbow of fruits and vegetables\n   - Focus on leafy greens and colorful produce\n\n5. Hydration:\n   - 3-4L of water daily\n   - More if active or in hot climates"
    ],
    "supplements": [
        "Supplement Guide (Most to Least Important):\n\n1. Protein Powder:\n   - Whey, casein, or plant-based\n   - 20-40g post-workout or between meals\n\n2. Creatine Monohydrate:\n   - 5g daily\n   - No loading phase needed\n   - Safe and well-researched\n\n3. Omega-3 (Fish Oil):\n   - 1-3g EPA+DHA daily\n   - Reduces inflammation\n\n4. Multivitamin:\n   - Covers micronutrient gaps\n   - Choose a high-quality brand\n\n5. Vitamin D3:\n   - 2000-5000 IU daily\n   - Especially important in winter"
    ],
    "recovery": [
        "Optimal Recovery Strategies:\n\n1. Sleep:\n   - 7-9 hours per night\n   - Consistent sleep schedule\n   - Cool, dark, quiet environment\n\n2. Nutrition:\n   - Post-workout protein + carbs\n   - Stay hydrated\n   - Anti-inflammatory foods (berries, fatty fish, leafy greens)\n\n3. Active Recovery:\n   - Light cardio (walking, swimming, cycling)\n   - Yoga or mobility work\n   - Foam rolling\n\n4. Rest Days:\n   - Take 1-2 full rest days per week\n   - Listen to your body\n   - Focus on mobility and flexibility"
    ],
    "default": [
        "I'm here to help with all aspects of fitness and wellness. You can ask me about:\n\n- Workout plans and exercises\n- Nutrition and meal planning\n- Weight loss strategies\n- Muscle building\n- Cardio training\n- Recovery and rest\n- Supplement advice\n- Healthy lifestyle tips\n\nWhat would you like to know more about?",
        "I can help you with various fitness topics including workout routines, diet plans, weight management, and healthy living. Could you be more specific about what you'd like to know?"
    ]
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_message = request.json.get('message', '').lower()
    
    # Simple keyword matching
    response = None
    for key in RESPONSES:
        if key in user_message:
            response = random.choice(RESPONSES[key])
            break
    
    if not response:
        response = random.choice(RESPONSES['default'])
    
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
