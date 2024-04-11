import json
from unittest import TestCase
from unittest.mock import patch
from flask import Flask
from testingconfig import TestingConfig
from testapp import app

class TestUsersBlueprint(TestCase):

    def setUp(self):
        self.app = app
        self.app.config.from_object(TestingConfig)
        self.client = self.app.test_client()


    @patch('services.register_user')
    def test_register(self,mock_register):
        mock_register.return_value = {'message': 'User registered successfully', 'userID': 1}
        response = self.client.post('/register', json={'firstName_tel': 'tester', 'lastName_tel': 'man','email':'mate@email.com', 'password': 'testpass','suffix':'tel','userID':1})
        self.assertEqual(response.status_code, 201)
        mock_register.asser_called_once()


    @patch('routes.login_user')
    def test_login(self, mock_login):
        mock_login.return_value = {'id': 1, 'username': 'testuser'}
        response = self.client.post('/login', json={'username': 'testuser', 'password': 'testpass'})
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {'id': 1, 'username': 'testuser'})
        mock_login.assert_called_once()

    @patch('routes.login_user')
    def test_login_fail(self, mock_login):
        mock_login.return_value = None
        response = self.client.post('/login', json={'username': 'wronguser', 'password': 'wrongpass'})
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 401)
        self.assertIsNone(data)
        mock_login.assert_called_once()

    @patch('routes.predict')
    def test_prediction(self, mock_predict):
        mock_predict.return_value = {'prediction': 'result'}
        response = self.client.post('/predict', json={'data': 'test'})
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {'prediction': 'result'})
        mock_predict.assert_called_once()

    @patch('routes.save')
    def test_save(self, mock_save):
        mock_save.return_value = {'status': 'saved'}
        response = self.client.post('/save', json={'data': 'test'})
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {'status': 'saved'})
        mock_save.assert_called_once()