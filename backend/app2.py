import torch
from flask import Flask, jsonify
from flask import request
from flask_cors.decorator import cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import String
from dotenv import load_dotenv
import os
from translations import translations

load_dotenv()

from backend.DataProcessing import QuestionnaireNN, scaler, le

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# Configure SQLite database URI (replace 'sqlite:///test.db' with your MariaDB URI)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

model = QuestionnaireNN()
model.load_state_dict(torch.load('best_model4.pth'))
model.eval()
# Suppress deprecation warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)
def translate(term, lang_code='en'):
    """
    Translate a given term to the specified language.

    Parameters:
    - term (str): The term to translate.
    - lang_code (str): The language code for the translation (default: 'en' for English).

    Returns:
    - str: The translated term, or a message indicating the term or language code is not found.
    """
    if term in translations and lang_code in translations[term]:
        return translations[term][lang_code]
    else:
        return f"Translation for '{term}' in language '{lang_code}' not found."

# Define database models
class User(db.Model):
    __tablename__ = 'User'
    firstName = db.Column(db.Integer, primary_key=True)
    lastName = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    password = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Integer, unique=True, nullable=False)

class Degree(db.Model):
    __tablename__ = 'Degree'
    degreeID = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.Integer, nullable=False)
    userID = db.Column(db.Integer, db.ForeignKey('User.userID'))

class AnswerSheet(db.Model):
    __tablename__ = 'AnswerSheet'
    answers = db.Column(String, nullable=False)
    answerID = db.Column(db.Integer, primary_key=True,autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('User.userID'))


# Define routes
@app.route('/')
def index():
    return 'Welcome to the Flask server hosting the database.'

# Example route to fetch all users
@app.route('/users')
def get_users():

    users = User.query.all()
    users_list = [{'firstName': user.firstName, 'lastName': user.lastName, 'email': user.email} for user in users]
    return jsonify(users_list)
@app.route('/login', methods=['POST'])
def login_user():
    user_data = request.get_json()
    email = user_data.get('email')
    password = user_data.get('password')
    user = User.query.filter_by(email=email, password=password).first()

    # If the user exists, return a success message. Otherwise, return an error message.
    if user is not None:
        return jsonify({'message': 'Login successful','userID': user.userID}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401
@app.route('/register', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def register_user():
    # Extract user data from request body
    user_data = request.get_json()
    # Create a new User instance
    new_user = User(
        firstName=user_data['firstName'],
        lastName=user_data['lastName'],
        email=user_data['email'],
        password=user_data['password']
    )

    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully', 'userID': new_user.userID }), 201
@app.route('/predict', methods=['POST'])
def predict():
    # Parses JSON data from the request body
    data = request.json.get('data', [])
    lang_code = request.json.get('lang', 'en')
    translationstext = {
        'en': {'prediction_text': 'Your predicted class is: {}'},
        'su': {'prediction_text': 'Ennustettu tutkintosi on: {}'},
        'tel': {'prediction_text': 'మీరు అంచనా వేసిన తరగతి: {}'}
    }
    # Preprocesses the input data
    input_data_scaled = scaler.transform([data])  # Scales the input data
    input_data_tensor = torch.tensor(input_data_scaled, dtype=torch.float32)  # Converts to tensor

    # Makes a prediction
    with torch.no_grad():
        output = model(input_data_tensor)
    _, predicted_class = torch.max(output.data, 1)
    translation_template = translationstext.get(lang_code, translationstext['en'])['prediction_text']

    # Converts predicted class index to label
    predicted_class_name = le.inverse_transform([predicted_class.item()])
    response_text = translation_template.format(translate(predicted_class_name[0],lang_code))

   # user_data = request.get_json()
    #Parse json data from req body
    #new_Answers = AnswerSheet( #Inserts values data=answers and userid into table answerSheet
     #   answers=str(user_data['data']), #questionaire answers
      #  userID=user_data['userID']#UserID
    #)
   # new_Degree = Degree(
        #enters into table Degree userID and the degree they got from the questionnaire
    #    userID=user_data['userID'],
     #   name=[predicted_class_name]
    #)

    #db.session.add(new_Answers)
    #db.session.commit()

    #db.session.add(new_Degree)
    #db.session.commit()

    # Returns the prediction
    return jsonify({'response': response_text})
@app.route('/save',methods=['POST'])
def save():
    user_data = request.get_json()
    new_Answers = AnswerSheet(
        answers=user_data['data'],
        userID=user_data['userID']
    )

    db.session.add(new_Answers)
    db.session.commit()
    return jsonify({'message':'Answers succesfully saved'})


if __name__ == '__main__':
    # Create the database tables (remove 'app.db' if you're using MariaDB)
    with app.app_context():
        db.create_all()
    app.run(debug=True)