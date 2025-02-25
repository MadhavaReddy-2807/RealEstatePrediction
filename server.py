from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import json
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load JSON data
with open("columns.json", "r") as file:
    data = json.load(file)

# Load trained model
with open("model.pickle", "rb") as file:
    model = pickle.load(file)

# Extract column names
column_names = data.get("data_columns", [])  # Use .get() to avoid KeyError

def predict_price(location, sqft, bhk, bath):
    """
    Predicts the house price based on input features.
    """
    try:
        x = np.zeros(len(column_names))  # Create input array

        x[0] = sqft
        x[1] = bath
        x[2] = bhk

        # One-hot encode the location
        if location in column_names:
            loc_index = column_names.index(location)
            x[loc_index] = 1  

        return round(model.predict([x])[0], 2)  # Return rounded prediction

    except Exception as e:
        return f"Error: {str(e)}"

@app.route("/columns", methods=["GET"])
def get_columns():
    """API endpoint to return column names."""
    return jsonify({"columns": column_names})

@app.route("/predict", methods=["POST"])
def predict():
    """API endpoint to predict house prices."""
    try:
        req_data = request.get_json()
        location = req_data.get("location")
        sqft = req_data.get("sqft")
        bhk = req_data.get("bhk")
        bath = req_data.get("bath")

        if None in [location, sqft, bhk, bath]:  
            return jsonify({"error": "Missing parameters"}), 400

        price = predict_price(location, sqft, bhk, bath)
        return jsonify({"predicted_price": price})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Column Names:", column_names)
    app.run(debug=True)
