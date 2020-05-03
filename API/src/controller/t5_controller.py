from src.model.t5_model import T5_Model


class T5_Controller:
    _t5_model = T5_Model(model_index=1)

    @staticmethod
    def get():
        return "T5 model loaded"

    @staticmethod
    def get_answer(sentence):
        return T5_Controller._t5_model.get_answers(sentence)


if __name__ == "__main__":
    print(T5_Controller.get())
