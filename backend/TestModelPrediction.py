
import unittest
from sklearn.preprocessing import StandardScaler, LabelEncoder
import torch
import numpy as np
from DataProcessing import QuestionnaireNN, scaler, le, y


class TestModelPredictions(unittest.TestCase):
    def setUp(self):
        self.model = QuestionnaireNN()
        self.model.load_state_dict(torch.load('best_model4.pth'))
        self.model.eval()

    def test_prediction_shape(self):

        input_data = torch.rand(1, 25)
        with torch.no_grad():
            output = self.model(input_data)
        self.assertEqual(output.shape, (1, len(set(y))))

