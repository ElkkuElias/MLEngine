from flask import Blueprint, request, jsonify
from services import login_user, register_user, predict, save

users_blueprint = Blueprint('users', __name__)

@users_blueprint.route('/register', methods=['POST'])
def register():
    user_data = request.get_json()
    new_user = register_user(user_data)
    return jsonify(new_user), 201

@users_blueprint.route('/login', methods=['POST'])
def login():
    credentials = request.get_json()
    user = login_user(credentials)
    if user:
        return jsonify(user), 200
    else:
        return jsonify(user), 401

@users_blueprint.route('/predict', methods=['POST'])
def prediction():
    user_data = request.get_json()
    user_prediction = predict(user_data)
    return jsonify(user_prediction)
@users_blueprint.route('/save', methods=['POST'])
def persist():
    user_data = request.get_json()
    save_user = save(user_data)
    return jsonify(save_user)
