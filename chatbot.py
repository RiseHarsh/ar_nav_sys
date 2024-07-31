from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

# Define a dictionary of responses
responses = {
    "hi": "Hello! How can I help you today?",
    "how are you": "I'm just a bot, but I'm doing well. How about you?",
    "what is your name": "I'm a chatbot. I don't have a name, but you can call me Chatbot.",
    "start navigation": "To start navigation, please enter your current location and your destination.",
    "nearest restrooms": "Sure! Please allow me access to your current location, and I'll show you the nearest restrooms.",
    "find the main entrance": "The main entrance is marked with a large blue arrow in the AR view. Just follow the arrow to reach the main entrance.",
    "landmarks near me": "I can help with that! Let me access your location to show nearby landmarks on your AR view.",
    "time to reach my destination": "Based on your current location and the destination, it should take approximately 10 minutes on foot.",
    "shortcut to the library": "Yes, there is a shortcut. Follow the highlighted path in your AR view to take the quickest route to the library.",
    "way to the cafeteria": "Sure! Follow the green path in your AR view to reach the cafeteria.",
    "help finding the conference room": "No problem! Just enter the name or number of the conference room, and I will guide you there.",
    "find a charging station": "There are charging stations located throughout the building. Let me show them in your AR view.",
    "is there an elevator nearby": "Yes, there's an elevator close to you. Follow the yellow path in your AR view to reach it.",
    "bye": "Goodbye! Have a great day!"
}

# Function to generate a response
def get_response(user_input):
    user_input = user_input.lower()
    for key in responses:
        if re.search(r'\b' + re.escape(key) + r'\b', user_input):
            return responses[key]
    return "Sorry, I don't understand that. Can you please rephrase?"

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    response = get_response(user_message)
    return jsonify({'response': response})

if __name__ == "__main__":
    app.run(debug=True)
