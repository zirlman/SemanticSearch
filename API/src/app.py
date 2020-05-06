from flask import Flask, request, jsonify
from src.controller.qa_controller import QA_Controller

app = Flask(__name__)


@app.route('/api/qa', methods=["GET"])
def index():
    return QA_Controller.get()


@app.route('/api/qa', methods=["POST"])
def generate_answer():
    assert request.is_json
    inputs = request.json.get("input")
    response = {"answers": QA_Controller.get_answers(inputs)}
    return jsonify(response)


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
