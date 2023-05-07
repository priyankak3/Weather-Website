import numpy as np
import requests
from flask import Flask, request, jsonify, render_template
import pickle

# Create flask app
flask_app = Flask(__name__, template_folder="Template")
model = pickle.load(open("trained_model.sav", "rb"))

@flask_app.route('/get-prediction', methods=['POST'])
def get_prediction():
    data = request.get_json()
    max_temperature = data['max_temperature']
    min_temperature = data['min_temperature']
    float_features = np.array([0, max_temperature, min_temperature])
    features = [float_features]
    prediction = model.predict(features)
    rounded_prediction = round(prediction[0], 2)
    return jsonify({'prediction': rounded_prediction})
@flask_app.route('/pollutants')
def poll():
    return render_template('pollutants.html')

@flask_app.route('/highlights')
def hig():
    return render_template('highlights.html')

@flask_app.route('/past_details')
def past():
    return render_template('past_details.html')

@flask_app.route('/graph')
def gr():
    return render_template('graph.html')

@flask_app.route('/travel')
def tr():
    return render_template('travel.html')
@flask_app.route("/")
def Home():
    response = requests.get('https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=49cc8c821cd2aff9af04c9f98c36eb74&units=metric')
    if response.ok:
        data = response.json()
        max_temperature = data["main"]["temp_max"] 
        min_temperature = data["main"]["temp_min"] 

    
        float_features = np.array([0, max_temperature, min_temperature])

        features = [float_features]
        prediction = model.predict(features)
        rounded_prediction = round(prediction[0], 2)
        return render_template("index.html", prediction_text="{}".format(rounded_prediction))
    else:
        return render_template("index.html", prediction_text="Error fetching weather data")


if __name__ == "__main__":
    flask_app.run(debug=True)



