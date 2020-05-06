from src.pipeline.qa_pipeline import QAPipeline


class QA_Controller:
    _qa_pipeline = QAPipeline(model_index=0)

    @staticmethod
    def get():
        return "QA Controller"

    @staticmethod
    def get_answers(inputs):
        return QA_Controller._qa_pipeline.get_answers(inputs)


# if __name__ == "__main__":
#     print(QA_Controller.get())
