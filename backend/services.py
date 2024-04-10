from models import User, Degree, AnswerSheet
from DataProcessing import QuestionnaireNN, scaler, le
import torch
from translations import translate
from DBInit import db


#Fucntion to register a user
def register_user(user_data):

    # Create a new User instance based on the suffix for example user_su
    if (user_data['suffix'] == 'su'):
        new_user = User(
            firstName_su=user_data['firstName_su'],
            lastName_su=user_data['lastName_su'],
            email=user_data['email'],
            password=user_data['password'],

        )
    elif (user_data['suffix'] == 'tel'):
        new_user = User(
            firstName_tel=user_data['firstName_tel'],
            lastName_tel=user_data['lastName_tel'],
            email=user_data['email'],
            password=user_data['password'],

        )
    else:
        new_user = User(
            firstName_en=user_data['firstName_en'],
            lastName_en=user_data['lastName_en'],
            email=user_data['email'],
            password=user_data['password'],

        )

    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return {'message': 'User registered successfully', 'userID': new_user.userID}

#Function to login user
def login_user(user_data):
    #get the email and password from the request
    email = user_data.get('email')
    password = user_data.get('password')
    #check if theyre in the database
    user = User.query.filter_by(email=email, password=password).first()


    if user is not None:
        #if it exists login
        return {'message': 'Login successful','userID': user.userID}
    else:
        #if not error msg
        return {'message': 'Invalid email or password'}
def predict(user_data):
    model = QuestionnaireNN()
    model.load_state_dict(torch.load('best_model4.pth'))
    model.eval()
    # Parse JSON data from the request body
    data = user_data.get('data', [])
    #Parse the languagecode from the request
    lang_code =user_data.get('lang', 'en')
    #Return a response text based on the users language code
    translationstext = {
        'en': {'prediction_text': 'Your predicted class is: {}'},
        'su': {'prediction_text': 'Ennustettu tutkintosi on: {}'},
        'tel': {'prediction_text': 'మీరు అంచనా వేసిన తరగతి: {}'}
    }
    # Preprocesse the input data
    input_data_scaled = scaler.transform([data])  # Scale the input data
    input_data_tensor = torch.tensor(input_data_scaled, dtype=torch.float32)  # Convert to tensor

    # Make a prediction
    with torch.no_grad():
        output = model(input_data_tensor)
    _, predicted_class = torch.max(output.data, 1)
    translation_template = translationstext.get(lang_code, translationstext['en'])['prediction_text']

    # Convert predicted class index to label
    predicted_class_name = le.inverse_transform([predicted_class.item()])
    response_text = translation_template.format(translate(predicted_class_name[0],lang_code))


    #Parse json data from req body
    new_Answers = AnswerSheet( #Inserts values data=answers and userid into table answerSheet
        answers=str(user_data['data']), #questionaire answers
        userID=user_data['userID']#UserID
    )
    new_Degree = Degree(
       # enters into table Degree userID and the degree they got from the questionnaire
        userID=user_data['userID'],
       name=[predicted_class_name]
    )

    db.session.add(new_Answers)
    db.session.commit()

    db.session.add(new_Degree)
    db.session.commit()

    # Returns the prediction
    return {'response': response_text}
def save(user_data):
    #Parse the json data

    #create the instance with the json data
    new_Answers = AnswerSheet(
        answers=user_data['data'],
        userID=user_data['userID']
    )
    #adds the data and commits it
    db.session.add(new_Answers)
    db.session.commit()
    #upon success return
    return {'message':'Answers succesfully saved'}