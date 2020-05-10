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


@app.before_first_request
def init_controller():
    QA_Controller.init()


def main():
    app.run(debug=True, port=33507)


if __name__ == '__main__':
    main()
