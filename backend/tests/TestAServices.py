import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from services import register_user, login_user, save, predict
from testapp import app
from models import User
from testingconfig import TestingConfig

class BaseTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.app.config.from_object(TestingConfig)
        self.client = self.app.test_client()

class UserTestCase(BaseTestCase):

    def test_register_user(self):


        user_data = {
            'suffix': 'en',
            'firstName_en': 'John',
            'lastName_en': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'password123'
        }

        with self.app.app_context():
            response = register_user(user_data)
            self.assertEqual(response['message'], 'User registered successfully')
            user = User.query.filter_by(email='john.doe@example.com').first()

        self.assertIsNotNone(user)
        self.assertEqual(user.firstName_en, 'John')
    def test_login_user(self):
        user_data = {
            'email': 'john.doe@example.com',
            'password': 'password123'
        }
        with self.app.app_context():
            response = login_user(user_data)
            self.assertEqual(response['message'], 'Login successful')
    def test_login_user_fail(self):
        user_data = {
            'email': 'johns.does@wrong.com',
            'password': 'wrong123'
        }
        with self.app.app_context():
            response = login_user(user_data)
            self.assertEqual(response['message'], 'Invalid email or password')
    def test_saving(self):
        user_data = {
            'data': '[5,2,1,2,1,5,2,2,1,2,3,2,3,2,5,5,2,1,2,4,1,1,1,2,5]',
            'userID':'1'
        }
        with self.app.app_context():
            response = save(user_data)
            self.assertEqual(response['message'], 'Answers succesfully saved')

    def test_prediction(self):


        user_data = {
            'data': [None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None],
            'userID':'1',
            'lang':'en'
        }

        with self.app.app_context():
            response = predict(user_data)
            self.assertEqual(response['response'], 'Your predicted class is: 3D animation and visualization')
