import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import torch
import os
from torch.utils.data import DataLoader, TensorDataset
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Loads the dataset
df = pd.read_csv('questionnaire.csv')

scaler = StandardScaler()
# Separates features and labels
X = df.drop('RecommendedStudyPath', axis=1).values.astype(float)
y = LabelEncoder().fit_transform(df['RecommendedStudyPath'])



# Splits the data into training, validation, and test sets
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)  # Temp is the combined validation and test set
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)  # Split the temp set into validation and test sets

# Scales the data
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled = scaler.transform(X_val)
X_test_scaled = scaler.transform(X_test)

# Converts to PyTorch tensors
X_train_tensor = torch.tensor(X_train_scaled, dtype=torch.float32)
y_train_tensor = torch.tensor(y_train, dtype=torch.long)
X_val_tensor = torch.tensor(X_val_scaled, dtype=torch.float32)
y_val_tensor = torch.tensor(y_val, dtype=torch.long)
X_test_tensor = torch.tensor(X_test_scaled, dtype=torch.float32)
y_test_tensor = torch.tensor(y_test, dtype=torch.long)

# Creates TensorDatasets
train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
val_dataset = TensorDataset(X_val_tensor, y_val_tensor)
test_dataset = TensorDataset(X_test_tensor, y_test_tensor)

# Creates DataLoaders
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=64, shuffle=False)
test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

class QuestionnaireNN(nn.Module): #creates a neural network
    def __init__(self):
        super(QuestionnaireNN, self).__init__()
        self.fc1 = nn.Linear(25, 200)
        self.dropout1 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(200, 100)
        self.dropout2 = nn.Dropout(0.5)
        self.fc3 = nn.Linear(100, 50)
        self.fc4 = nn.Linear(50, len(set(y)))

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.dropout1(x)
        x = F.relu(self.fc2(x))
        x = self.dropout2(x)
        x = F.relu(self.fc3(x))
        x = self.fc4(x)
        return x

model = QuestionnaireNN()

# Defines the optimizer and the loss function (criterion)
optimizer = optim.Adam(model.parameters(), lr=0.01)
criterion = nn.CrossEntropyLoss()

# Creates a DataLoader for the validation set
val_loader = DataLoader(val_dataset, batch_size=64, shuffle=False)

# Updates the training loop to include validation
num_epochs = 30
best_val_accuracy = 0
for epoch in range(num_epochs):
    model.train()
    for inputs, targets in train_loader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()

    model.eval()
    val_correct = 0
    val_total = 0
    with torch.no_grad():
        for inputs, targets in val_loader:
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)
            val_total += targets.size(0)
            val_correct += (predicted == targets).sum().item()
    val_accuracy = 100 * val_correct / val_total
    if val_accuracy > best_val_accuracy:
        best_val_accuracy = val_accuracy
        # Saves best model
        torch.save(model.state_dict(), 'best_model4.pth')



# Assumes input_data is your data
input_data = [5,2,1,2,1,5,2,2,1,2,3,2,3,2,5,5,2,1,2,4,1,1,1,2,5]

# Scales the input data and convert it to PyTorch tensor
input_data_scaled = scaler.transform([input_data])
input_data_tensor = torch.tensor(input_data_scaled, dtype=torch.float32)

# Sets the model to evaluation mode
model.eval()

# Feeds the input data to the model and gets the output
with torch.no_grad():
    output = model(input_data_tensor)

# Gets the predicted class
_, predicted_class = torch.max(output.data, 1)



le = LabelEncoder()
le.fit(df['RecommendedStudyPath'])


print("Ready to Predict!")