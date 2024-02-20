from flask import Flask, request, jsonify
import torch
from DataProcessing import QuestionnaireNN,scaler,le  # Replace with the name of your Python file containing the model class

app = Flask(__name__)

# Load your trained model
model = QuestionnaireNN()
model.load_state_dict(torch.load('best_model4.pth'))
model.eval()

# Assuming your scaler is loaded here
# scaler = joblib.load('your_scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    # Parse JSON data from the request body
    data = request.json.get('data', [])  # 'data' is a key in the JSON request where the input data is stored

    # Preprocess the input data
    input_data_scaled = scaler.transform([data])  # Scale the input data
    input_data_tensor = torch.tensor(input_data_scaled, dtype=torch.float32)  # Convert to tensor

    # Make a prediction
    with torch.no_grad():
        output = model(input_data_tensor)
    _, predicted_class = torch.max(output.data, 1)

    # Convert predicted class index to label
    predicted_class_name = le.inverse_transform([predicted_class.item()])

    # Return the prediction
    return jsonify({'predicted_class': predicted_class_name[0]})

if __name__ == '__main__':
    app.run(debug=True)
