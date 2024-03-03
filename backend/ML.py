import torch.nn as nn  # Importing the neural network module
import torch.nn.functional as F  # Importing the functional interface

# Define a simple neural network class inheriting from nn.Module
class SimpleNN(nn.Module):
    def __init__(self, input_size, num_classes):
        super(SimpleNN, self).__init__()  # Initialize the superclass
        self.fc1 = nn.Linear(input_size, 50)  # First fully connected layer from input_size to 50 neurons
        self.fc2 = nn.Linear(50, num_classes)  # Second fully connected layer from 50 neurons to num_classes

    def forward(self, x):
        x = F.relu(self.fc1(x))  # Apply ReLU activation function after the first layer
        x = self.fc2(x)  # No activation after the last layer, raw output is returned
        return x
