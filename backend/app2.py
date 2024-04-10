from flask import Flask, jsonify
from routes import users_blueprint
from config import Config
from DBInit import db
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

app.register_blueprint(users_blueprint)
db.init_app(app)

if __name__ == '__main__':
    app.run(debug=True)