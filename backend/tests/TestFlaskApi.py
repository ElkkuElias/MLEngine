from flask import Flask, jsonify, request
import unittest
from unittest.mock import patch

from FlaskServer import app




class TestFlaskAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('FlaskServer.QuestionnaireNN')  # Patches the model
    @patch('FlaskServer.scaler.transform')  # Patches the scaler
    @patch('FlaskServer.le.inverse_transform')  # Patches the LabelEncoder
    def test_predict_endpoint(self, mock_inverse_transform, mock_transform, mock_model):
        # Sets up mock return values
        mock_model.return_value.eval.return_value = mock_model
        mock_transform.return_value = [[0] * 25]  # Mocks scaled input
        mock_inverse_transform.return_value = ["MockedClassName"]

        # Simulates a POST request
        response = self.app.post('/predict', json={'data': [0] * 25})

        # Checks the response status code and data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'predicted_class': 'MockedClassName'})
