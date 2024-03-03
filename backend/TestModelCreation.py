import unittest
from sklearn.preprocessing import StandardScaler, LabelEncoder
import torch
import numpy as np


class TestDataPreprocessing(unittest.TestCase):
    def test_scaler(self):
        data = np.array([[1, 2, 3], [4, 5, 6]])
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(data)
        self.assertEqual(scaled_data.shape, data.shape)

    def test_label_encoder(self):
        labels = ['cat', 'dog', 'cat']
        encoder = LabelEncoder()
        encoded_labels = encoder.fit_transform(labels)
        self.assertEqual(set(encoded_labels), {0, 1})

    def test_tensor_conversion(self):
        data = np.array([[1, 2, 3], [4, 5, 6]])
        data_tensor = torch.tensor(data, dtype=torch.float32)
        self.assertIsInstance(data_tensor, torch.Tensor)
        self.assertEqual(data_tensor.dtype, torch.float32)

