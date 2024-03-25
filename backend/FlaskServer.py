from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from DataProcessing import QuestionnaireNN,scaler,le
import mysql

app = Flask(__name__)
CORS(app)
# Loads the trained model
model = QuestionnaireNN()
model.load_state_dict(torch.load('best_model4.pth'))
model.eval()



@app.route('/predict', methods=['POST'])
def predict():
    # Parses JSON data from the request body
    data = request.json.get('data', [])

    # Preprocesses the input data
    input_data_scaled = scaler.transform([data])  # Scales the input data
    input_data_tensor = torch.tensor(input_data_scaled, dtype=torch.float32)  # Converts to tensor

    # Makes a prediction
    with torch.no_grad():
        output = model(input_data_tensor)
    _, predicted_class = torch.max(output.data, 1)

    # Converts predicted class index to label
    predicted_class_name = le.inverse_transform([predicted_class.item()])

    # Returns the prediction
    return jsonify({'predicted_class': predicted_class_name[0]})

if __name__ == '__main__':
    app.run(debug=True)
