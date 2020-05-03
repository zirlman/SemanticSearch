from src.controller.t5_controller import T5_Controller
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/t5_model', methods=["GET"])
def index():
    return T5_Controller.get()


@app.route('/api/t5_model', methods=["POST"])
def generate_answer():
    assert request.is_json
    sentence = request.json.get("input")
    response = {"answers": T5_Controller.get_answer(sentence)}
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
